package com.example.TestSecurity.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NowUserResponseDTO {

    private Integer id;
    private String username;
    private String role;
    private Integer isSetCat;
    private String cat1;
    private String cat2;
    private String cat3;


}