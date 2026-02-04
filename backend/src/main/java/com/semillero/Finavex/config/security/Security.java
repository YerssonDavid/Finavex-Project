package com.semillero.Finavex.config.security;

import com.semillero.Finavex.config.jwtConfig.JwtAuthenticationFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class Security {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                // Disable session management - make it stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/Users/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/Users/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "AI/chat/question/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/code-recovery/**").permitAll()
                        // Rutas que requieren autenticación (eliminadas de permitAll):
                        // - /save-money/** ahora requiere token JWT
                        //.requestMatchers(HttpMethod.POST, "/movements").permitAll()
                        //.requestMatchers(HttpMethod.POST, "/recover-password/recover-password").permitAll()
                        //.requestMatchers(HttpMethod.POST, "recover-password/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/get/money-now").permitAll()
                        .requestMatchers(HttpMethod.POST, "/sum-total-save-month").permitAll()
                        .requestMatchers(HttpMethod.POST, "/error").permitAll()
                        .requestMatchers(HttpMethod.POST, "/expenses/month/sum").permitAll()
                        .requestMatchers(HttpMethod.POST, "/expenses/registry").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/ai-voice").permitAll()
                        .requestMatchers(HttpMethod.GET, "/response/*").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        //Permit access without authorization to Swagger UI and API docs from Route "http://localhost:8080/swagger-ui/index.html"
                        .requestMatchers(
                                "/swagger-ui/index.html",
                                "/v3/api-docs/**",
                                "/swagger-ui/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(basic -> {});

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization", "*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }

    //Autentication manager
    @Bean
    public AuthenticationManager authenticationManager(){
        return authentication -> authentication;
    }
}