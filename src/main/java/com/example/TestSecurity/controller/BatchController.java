//package com.example.TestSecurity.controller;
//
//import org.springframework.batch.core.Job;
//import org.springframework.batch.core.JobParameters;
//import org.springframework.batch.core.JobParametersBuilder;
//import org.springframework.batch.core.configuration.JobRegistry;
//import org.springframework.batch.core.launch.JobLauncher;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/batch")
//public class BatchController {
//
//    private final JobLauncher jobLauncher;
//    private final JobRegistry jobRegistry;
//
//    @Autowired
//    public BatchController(JobLauncher jobLauncher, JobRegistry jobRegistry) {
//        this.jobLauncher = jobLauncher;
//        this.jobRegistry = jobRegistry;
//    }
//
//    @PostMapping("/start")
//    public ResponseEntity<String> startBatch() {
//        try {
//            JobParameters jobParameters = new JobParametersBuilder()
//                    .addLong("time", System.currentTimeMillis())
//                    .toJobParameters();
//
//            jobLauncher.run(jobRegistry.getJob("firstJob"), jobParameters);
//            return new ResponseEntity<>("Batch job started successfully", HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>("Error starting batch job: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
////    @GetMapping("/first")
////    public String firstApi(@RequestParam("value") String value) throws Exception {
////
////        JobParameters jobParameters = new JobParametersBuilder()
////                .addString("date", value)
////                .toJobParameters();
////
////        jobLauncher.run(jobRegistry.getJob("firstJob1"), jobParameters);
////
////
////        return "ok";
////    }
//}