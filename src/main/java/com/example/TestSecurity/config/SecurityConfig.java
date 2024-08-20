package com.example.TestSecurity.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.IOException;


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

                        /// 리액트 접근 권한
                        .requestMatchers( HttpMethod.GET, "/index*", "/static/**", "/*.js", "/*.json", "/*.ico", "/rest")
                        .permitAll()

                        /// 페이지 접근 권한
                        .requestMatchers("/index.html","/test","/login", "/logout","/join","/joinProc","/common","/welcome",
                                "/community","/community/recipe", "/community/recipe/*",
                                "/")
                        .permitAll()

                        .requestMatchers("/community/update/*", "/community/write")
                        .authenticated()

                        .requestMatchers("/admin")
                        .hasRole("ADMIN")



                        /// api 호출 접근 권한
                        .requestMatchers( HttpMethod.GET, "/recipe", "/recipe/*", "/recipe/ingredient/*")
                        .permitAll()

                        /// api 호출 접근 권한
                        .requestMatchers( HttpMethod.POST, "/checkdupid", "/recipe", "/recipe/recipeig")
                        .permitAll()

                        // 삭제 권한 설정 필요
                        .requestMatchers( HttpMethod.DELETE, "/recipe/*")
                        .authenticated()

                        // 업데이트 권한 설정 필요
                        .requestMatchers( HttpMethod.PUT, "/recipe/*")
                        .authenticated()


                        .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                        .anyRequest().authenticated()

                ).exceptionHandling((exception)->exception
                        .authenticationEntryPoint(authenticationEntryPoint()) // 인증되지 않은 페이지 접근 시
                        .accessDeniedHandler(new DeniedPageHandler()) // 접근 거부된 페이지 접근 시
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

        // 로그아웃 설정
        http
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

    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.AuthenticationException authException) -> {
            response.setContentType("text/html;charset=UTF-8");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(
                    "<script>" +
                            "alert('로그인 후 이용해주세요.');" +
                            "window.location.href = '/login';" +
                            "</script>"
            );
        };
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