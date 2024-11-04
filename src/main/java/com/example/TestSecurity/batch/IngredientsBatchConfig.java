package com.example.TestSecurity.batch;

import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import com.example.TestSecurity.config.DataDBConfig;
import com.example.TestSecurity.config.MetaDBConfig;
import com.example.TestSecurity.entity.TestCrawlingRecipe;
import com.example.TestSecurity.entity.UnitTestIngredients;
import com.example.TestSecurity.repository.TestCrawlingRecipeRepository;
import com.example.TestSecurity.repository.UnitTestIngredientsRepository;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.*;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
import org.springframework.batch.item.database.builder.JdbcPagingItemReaderBuilder;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import javax.xml.crypto.Data;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
@EnableBatchProcessing
public class IngredientsBatchConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final TestCrawlingRecipeRepository testCrawlingRecipeRepository;
    private final UnitTestIngredientsRepository unitTestIngredientsRepository;
    private final DataSource dataSource;
    private final DataDBConfig dataDBConfig;

    // Pattern을 클래스의 상수로 선언하여 한 번만 컴파일되도록 설정
    private static final Pattern QUANTITY_UNIT_PATTERN = Pattern.compile("([\\d\\.]+)([가-힣a-zA-Z]+)");
    private static final Pattern QUANTITY_ONLY_PATTERN = Pattern.compile("^[\\d\\.]+$");
    private static final Pattern UNIT_ONLY_PATTERN = Pattern.compile("^[가-힣a-zA-Z]+$");
    private static final Pattern SECTION_PATTERN = Pattern.compile("\\[(.*?)\\]");

    public IngredientsBatchConfig(JobRepository jobRepository, PlatformTransactionManager platformTransactionManager, TestCrawlingRecipeRepository testCrawlingRecipeRepository, UnitTestIngredientsRepository unitTestIngredientsRepository, DataSource dataSource, DataDBConfig dataDBConfig) {
        this.jobRepository = jobRepository;
        this.platformTransactionManager = platformTransactionManager;
        this.testCrawlingRecipeRepository = testCrawlingRecipeRepository;
        this.unitTestIngredientsRepository = unitTestIngredientsRepository;
        this.dataSource = dataSource;
        this.dataDBConfig = dataDBConfig;
    }


    @Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(8);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("MultiThreaded-");
        return executor;
    }


    @Bean
    public Job firstJob() {
        return new JobBuilder("firstJob", jobRepository)
                .start(step1())
                .build();
    }


    @Bean
    public Step step1() {
        return new StepBuilder("step1", jobRepository)
                .<TestCrawlingRecipe, List<UnitTestIngredients>>chunk(5000, platformTransactionManager)
                .reader(reader())
                .processor(processor())
                .writer(new ItemWriter<List<UnitTestIngredients>>() {
                    @Override
                    public void write(Chunk<? extends List<UnitTestIngredients>> chunk) throws Exception {
                        JdbcBatchItemWriter<UnitTestIngredients> writer = writer();
                        for (List<UnitTestIngredients> ingredientsList : chunk.getItems()) {
                            writer.write(new Chunk<>(ingredientsList));
                        }
                    }
                })
                .taskExecutor(taskExecutor())
                .build();
    }

    @Bean
    public JdbcPagingItemReader<TestCrawlingRecipe> reader() {
        return new JdbcPagingItemReaderBuilder<TestCrawlingRecipe>()
                .name("reader")
                .dataSource(dataDBConfig.dataDBSource())
                .selectClause("SELECT recipe_number, ingredient_Content")
                .fromClause("FROM Test_Crawling_Recipe")
                .sortKeys(Map.of("recipe_number", Order.ASCENDING))
                .rowMapper((rs, rowNum) -> {
                    TestCrawlingRecipe recipe = new TestCrawlingRecipe();
                    recipe.setRecipeNumber(rs.getInt("recipe_number"));
                    recipe.setIngredientsContent(rs.getString("ingredient_Content"));
                    return recipe;
                })
                .pageSize(100)
                .build();
    }

    @Bean
    public ItemProcessor<TestCrawlingRecipe, List<UnitTestIngredients>> processor() {

        return recipe -> {
            List<UnitTestIngredients> ingredientsToSave = new ArrayList<>();
            String content = recipe.getIngredientsContent();
            int recipeNumber = recipe.getRecipeNumber();

            if (content != null && !content.isEmpty()) {
//              Pattern pattern = Pattern.compile("\\[(.*?)\\]");
//              Matcher matcher = pattern.matcher(content);
                Matcher matcher = SECTION_PATTERN.matcher(content);
                while (matcher.find()) {
                    String section = matcher.group(1);
                    String ingredientsSection = content.substring(matcher.end()).split("\\[")[0];
                    String[] ingredients = ingredientsSection.split("\\|");

                    for (String ingredient : ingredients) {
                        String[] parts = ingredient.trim().split("\\}\\{");
                        String ingredientName = parts[0].replaceAll("\\{", "").trim();

                        String quantity = "";
                        String unit = "";

                        if (parts.length > 1) {
                            String quantityAndUnit = parts[1].replaceAll("\\}", "").trim();
                            Matcher quantityUnitMatcher = QUANTITY_UNIT_PATTERN.matcher(quantityAndUnit);
                            Matcher quantityOnlyMatcher = QUANTITY_ONLY_PATTERN.matcher(quantityAndUnit);
                            Matcher unitOnlyMatcher = UNIT_ONLY_PATTERN.matcher(quantityAndUnit);

                            if (quantityUnitMatcher.find()) {
                                // 숫자+문자 조합이 있을 경우
                                quantity = quantityUnitMatcher.group(1);
                                unit = quantityUnitMatcher.group(2);

                            } else if (quantityOnlyMatcher.find()) {
                                // 숫자만 있는 경우
                                quantity = quantityOnlyMatcher.group();
                                unit = ""; // 단위는 빈 문자열로 설정

                            } else if (unitOnlyMatcher.find()) {
                                // 문자만 있는 경우
                                quantity = "0.0"; // 수량은 기본값 0.0으로 설정
                                unit = unitOnlyMatcher.group();
                            }
                        }

                        UnitTestIngredients unitTestIngredient = new UnitTestIngredients();
                        unitTestIngredient.setRecipeId(recipeNumber);
                        unitTestIngredient.setSection(section);
                        unitTestIngredient.setIngredientName(ingredientName);
                        unitTestIngredient.setQuantity(quantity.isEmpty() ? 0.0 : Double.parseDouble(quantity));
                        unitTestIngredient.setUnit(unit);

                        ingredientsToSave.add(unitTestIngredient);
                    }
                }
            }
            return ingredientsToSave;
        };
    }


    @Bean
    public JdbcBatchItemWriter<UnitTestIngredients> writer() {
        return new JdbcBatchItemWriterBuilder<UnitTestIngredients>()
                .sql("INSERT INTO Unit_Test_Ingredients (recipeId, section, ingredientName, quantity, unit) VALUES (:recipeId, :section, :ingredientName, :quantity, :unit)")
                .itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
                .dataSource(dataDBConfig.dataDBSource())
                .build();
    }


}