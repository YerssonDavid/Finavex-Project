package com.semillero.Finavex.config.jwtConfig;

import com.semillero.Finavex.services.jwt.TokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try{
            //Extract Header authorization of the request
            String authHeader = request.getHeader("Authorization");
            String token = tokenProvider.extractToken(authHeader);

            // verify if exists and start with Bearer
            if (token == null) {
                log.debug("No se encontro el token en el header");
                // Continue with the filter chain
                filterChain.doFilter(request, response);
                return;
            }

            if(!tokenProvider.validateToken(token)){
                log.debug("Token invalido!");
                filterChain.doFilter(request, response);
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                log.debug("Autenticación ya existe en el contexto");
                filterChain.doFilter(request, response);
                return;
            }

            String email = tokenProvider.extractEmail(token);
            Long userId = tokenProvider.extractUserId(token);

            if(email == null){
                log.debug("No se pudo extraer el email del token");
                filterChain.doFilter(request, response);
                return;
            }

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Load user from database
                UserDetails user = userDetailsService.loadUserByUsername(email);

                //Validate token with user details
                if (tokenProvider.validateToken(token)) {
                    //Build authentication
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, null, user.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Save the user in the security context
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }

        }catch (Exception e) {
            log.error("Error processing JWT token: {}", e.getMessage());
        }
        // Always continue with the filter chain
        filterChain.doFilter(request, response);
    }
}
