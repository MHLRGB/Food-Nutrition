package com.example.TestSecurity.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// 레시피 저장 테스트 테이블
@Data
@NoArgsConstructor
@Entity
@Table(name = "Unit_Test_Ingredients")
public class UnitTestIngredients {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 키 설정
    private Long id;

    @Column(name = "recipeId")
    private Integer recipeId;

    @Column(name = "section")
    private String section;

    @Column(name = "ingredientName")
    private String ingredientName;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "unit")
    private String unit;
}
