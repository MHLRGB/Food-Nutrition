// 데이터 바구니
package com.example.TestSecurity.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
public class Ingredients {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 20)
    private Long ingredient_id;

    @Column(name = "식품군")
    private String foodGroup;

    @Column(name = "식품명")
    private String foodName;

    @Column(name = "에너지_kcal")
    private Float energyKcal;

    @Column(name = "수분_g")
    private Float waterG;

    @Column(name = "단백질_g")
    private Float proteinG;

    @Column(name = "지방_g")
    private Float fatG;

    @Column(name = "회분_g")
    private Float ashG;

    @Column(name = "탄수화물_g")
    private Float carbohydrateG;

    @Column(name = "당류_g")
    private Float sugarG;

    @Column(name = "자당_g")
    private Float sucroseG;

    @Column(name = "포도당_g")
    private Float glucoseG;

    @Column(name = "과당_g")
    private Float fructoseG;

    @Column(name = "유당_g")
    private Float lactoseG;

    @Column(name = "맥아당_g")
    private Float maltoseG;

    @Column(name = "갈락토오스_g")
    private Float galactoseG;

    @Column(name = "총_식이섬유_g")
    private Float totalDietaryFiberG;

    @Column(name = "수용성_식이섬유_g")
    private Float solubleDietaryFiberG;

    @Column(name = "불용성_식이섬유_g")
    private Float insolubleDietaryFiberG;

    @Column(name = "칼슘_mg")
    private Float calciumMg;

    @Column(name = "철_mg")
    private Float ironMg;

    @Column(name = "마그네슘_mg")
    private Float magnesiumMg;

    @Column(name = "인_mg")
    private Float phosphorusMg;

    @Column(name = "칼륨_mg")
    private Float potassiumMg;

    @Column(name = "나트륨_mg")
    private Float sodiumMg;

    @Column(name = "아연_mg")
    private Float zincMg;

    @Column(name = "구리_mg")
    private Float copperMg;

    @Column(name = "망간_mg")
    private Float manganeseMg;

    @Column(name = "셀레늄_ug")
    private Float seleniumUg;

    @Column(name = "몰리브덴_ug")
    private Float molybdenumUg;

    @Column(name = "요오드_ug")
    private Float iodineUg;

    @Column(name = "비타민_A_ug")
    private Float vitaminAUg;

    @Column(name = "레티놀_ug")
    private Float retinolUg;

    @Column(name = "베타카로틴_ug")
    private Float betaCaroteneUg;

    @Column(name = "티아민_mg")
    private Float thiamineMg;

    @Column(name = "리보플라빈_mg")
    private Float riboflavinMg;

    @Column(name = "니아신_mg")
    private Float niacinMg;

    @Column(name = "니아신당량_NE_mg")
    private Float niacinEquivalentMg;

    @Column(name = "니코틴산_mg")
    private Float nicotinicAcidMg;

    @Column(name = "니코틴아미드_mg")
    private Float nicotinamideMg;

    @Column(name = "판토텐산_mg")
    private Float pantothenicAcidMg;

    @Column(name = "비타민_B6_mg")
    private Float vitaminB6Mg;

    @Column(name = "피리독신_mg")
    private Float pyridoxineMg;

    @Column(name = "비오틴_ug")
    private Float biotinUg;

    @Column(name = "엽산_엽산당량_ug")
    private Float folateEquivalentUg;

    @Column(name = "엽산_식품_엽산_ug")
    private Float dietaryFolateUg;

    @Column(name = "엽산_합성_엽산_ug")
    private Float syntheticFolateUg;

    @Column(name = "비타민_B12_ug")
    private Float vitaminB12Ug;

    @Column(name = "비타민_C_mg")
    private Float vitaminCMg;

    @Column(name = "비타민_D_ug")
    private Float vitaminDUg;

    @Column(name = "비타민_D2_ug")
    private Float vitaminD2Ug;

    @Column(name = "비타민_D3_ug")
    private Float vitaminD3Ug;

    @Column(name = "비타민_E_mg")
    private Float vitaminEMg;

    @Column(name = "알파_토코페롤_mg")
    private Float alphaTocopherolMg;

    @Column(name = "베타_토코페롤_mg")
    private Float betaTocopherolMg;

    @Column(name = "감마_토코페롤_mg")
    private Float gammaTocopherolMg;

    @Column(name = "델타_토코페롤_mg")
    private Float deltaTocopherolMg;

    @Column(name = "알파_토코트리에놀_mg")
    private Float alphaTocotrienolMg;

    @Column(name = "베타_토코트리에놀_mg")
    private Float betaTocotrienolMg;

    @Column(name = "감마_토코트리에놀_mg")
    private Float gammaTocotrienolMg;

    @Column(name = "델타_토코트리에놀_mg")
    private Float deltaTocotrienolMg;

    @Column(name = "비타민_K_ug")
    private Float vitaminKUg;

    @Column(name = "비타민_K1_ug")
    private Float vitaminK1Ug;

    @Column(name = "비타민_K2_ug")
    private Float vitaminK2Ug;
}