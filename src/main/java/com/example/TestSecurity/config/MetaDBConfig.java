//package com.example.TestSecurity.config;
//
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.boot.jdbc.DataSourceBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//import org.springframework.jdbc.datasource.DataSourceTransactionManager;
//import org.springframework.transaction.PlatformTransactionManager;
//
//import javax.sql.DataSource;
//
//@Configuration
//public class MetaDBConfig {
//
//    // DB 충돌 방지 위해 Primary 어노테이션 설정
//    @Primary
//    @Bean(name="dataSource")
//    @ConfigurationProperties(prefix = "spring.datasource-meta")
//    public DataSource metaDBSource() {
//
//        return DataSourceBuilder.create().build();
//    }
//
//    @Primary
//    @Bean(name="transactionManager")
//    public PlatformTransactionManager metaTransactionManager() {
//
//        return new DataSourceTransactionManager(metaDBSource());
//    }
//}
