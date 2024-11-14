//// 데이터 바구니
//package com.example.TestSecurity.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//@Entity
//@Setter
//@Getter
//public class Community {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Long id;
//
//    @Column(name = "title", nullable = false)
//    private String title;
//
//    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
//    private String content;
//
//    @Column(name = "category", nullable = false)
//    private String category;
//
//    @Column(name = "created_date", nullable = false)
//    private LocalDateTime createdDate;
//
//    @Column(name = "author", nullable = false)
//    private String author;
//
//    @PrePersist
//    protected void onCreate() {
//        createdDate = LocalDateTime.now();
//    }
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "recipe_id", nullable = true)  // recipe_id 컬럼이 null을 허용하도록 설정
//    private Recipe recipe;
//
//}