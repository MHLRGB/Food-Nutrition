package com.example.TestSecurity.config;

import jakarta.servlet.http.HttpSession;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {

        return new BCryptPasswordEncoder();
    }



    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
//        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
//        requestHandler.setCsrfRequestAttributeName("_csrf");

        // CORS 오류 대응
//        http.cors(httpSecurityCorsConfigurer ->
//                httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource())
//        );
//
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers( HttpMethod.GET, "/index*", "/static/**", "/*.js", "/*.json", "/*.ico", "/rest",
                                "/test","/login","/join","/joinProc","/common","/welcome","/")
                        .permitAll()
                        .requestMatchers("/index.html").permitAll()
                        .requestMatchers("/admin").hasRole("ADMIN")
                        .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                        .anyRequest().authenticated()

                );
        http
                .formLogin((auth) -> auth.loginPage("/login") // 오류 페이지 접근 시 자동으로 login 페이지로 리다이렉션
                        .loginProcessingUrl("/loginProc") // 프론트에서 넘겨준 login 정보를 Scurity가 받게 됨
                        .successHandler(new LoginSuccessHandler())
                        .permitAll()
                );

//        http
//                .addFilterAfter(new CsrfTokenLogger(), CsrfFilter.class)
//                .authorizeHttpRequests((auth) -> auth
//                        .anyRequest().permitAll()
//                );


        http
                .csrf((auth) -> auth.disable()); // csrf토큰을 보내지 않으면 로그인이 진행되지 않기 때문에 잠시 disable

        http
        // 로그아웃 설정
                .logout(logout -> logout
                // 로그아웃 요청을 처리할 URL 설정
                .logoutUrl("/logout")
                // 로그아웃 성공 시 리다이렉트할 URL 설정
                .logoutSuccessUrl("/login")
                // 로그아웃 핸들러 추가 (세션 무효화 처리)
                .addLogoutHandler((request, response, authentication) -> {
                    HttpSession session = request.getSession();
                    session.invalidate();
                })
                // 로그아웃 시 쿠키 삭제 설정 (예: "remember-me" 쿠키 삭제)
                // .deleteCookies("remember-me")
        );

        // csrf 관련 로직
//        http
//                .csrf(csrf->csrf
//                .csrfTokenRequestHandler(requestHandler)
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                .ignoringRequestMatchers("/", "/login", "/logout", "/join")
//        );

//        http
//                .sessionManagement((auth) -> auth
//                        .sessionFixation().changeSessionId() // 세션 고정 보호. 로그인 시 동일한 세션을 유지하지만, 발급되는 id를 바꿔줌. 보안용 설정
//                        .maximumSessions(1) // 하나의 아이디에서 동시 접속 중복 로그인 수
//                        .maxSessionsPreventsLogin(true)
//                        // 위의 값을 초과했을 경우
//                        // true : 새로운 로그인 차단
//                        // false : 기존 로그인 세션 하나 삭제 후 새로운 로그인 진행
//                        .expiredUrl("/"));




        return http.build();
    }

//    // CORS 오류 대응
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration corsConfiguration = new CorsConfiguration();
//
//        corsConfiguration.setAllowedOriginPatterns(List.of("*"));
//        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"));
//        corsConfiguration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
//        corsConfiguration.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", corsConfiguration); // 모든 경로에 대해서 CORS 설정을 적용
//
//        return source;
//    }


}