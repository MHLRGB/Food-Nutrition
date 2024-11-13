package com.example.TestSecurity.batch;

import com.example.TestSecurity.entity.AfterEntity;
import com.example.TestSecurity.entity.BeforeEntity;
import com.example.TestSecurity.repository.AfterRepository;
import com.example.TestSecurity.repository.BeforeRepository;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.data.RepositoryItemReader;
import org.springframework.batch.item.data.RepositoryItemWriter;
import org.springframework.batch.item.data.builder.RepositoryItemReaderBuilder;
import org.springframework.batch.item.data.builder.RepositoryItemWriterBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.Map;

import static com.fasterxml.jackson.databind.type.LogicalType.Map;

@Configuration
public class FirstBatch {

//    private final JobRepository jobRepository;
//    private final PlatformTransactionManager platformTransactionManager;
//
//    private final BeforeRepository beforeRepository;
//    private final AfterRepository afterRepository;
//
//
//    public FirstBatch(JobRepository jobRepository, PlatformTransactionManager platformTransactionManager, BeforeRepository beforeRepository, AfterRepository afterRepository) {
//
//        this.jobRepository = jobRepository;
//        this.platformTransactionManager = platformTransactionManager;
//        this.beforeRepository = beforeRepository;
//        this.afterRepository = afterRepository;
//    }
//
//    @Bean
//    public Job firstJob1() {
//
//        System.out.println("first job");
//
//        return new JobBuilder("firstJob1", jobRepository)
//                .start(firstStep())
//                .build();
//    }
//
//    @Bean
//    public Step firstStep() {
//
//        System.out.println("first step");
//
//        return new StepBuilder("firstStep", jobRepository)
//                .<BeforeEntity, AfterEntity> chunk(10, platformTransactionManager)
//                .reader(beforeReader())
//                .processor(middleProcessor())
//                .writer(afterWriter())
//                .build();
//    }
//
//    @Bean
//    public RepositoryItemReader<BeforeEntity> beforeReader() {
//
//        return new RepositoryItemReaderBuilder<BeforeEntity>()
//                .name("beforeReader")
//                .pageSize(10)
//                .methodName("findAll")
//                .repository(beforeRepository)
//                //.sorts(Map("id", Sort.Direction.ASC))
//                .sorts(java.util.Map.of("id", Sort.Direction.ASC))
//                .build();
//    }
//
//    @Bean
//    public ItemProcessor<BeforeEntity, AfterEntity> middleProcessor() {
//
//        return new ItemProcessor<BeforeEntity, AfterEntity>() {
//
//            @Override
//            public AfterEntity process(BeforeEntity item) throws Exception {
//
//                AfterEntity afterEntity = new AfterEntity();
//                afterEntity.setUsername(item.getUsername());
//
//                return afterEntity;
//            }
//        };
//    }
//
//    @Bean
//    public RepositoryItemWriter<AfterEntity> afterWriter() {
//
//        return new RepositoryItemWriterBuilder<AfterEntity>()
//                .repository(afterRepository)
//                .methodName("save")
//                .build();
//    }
}