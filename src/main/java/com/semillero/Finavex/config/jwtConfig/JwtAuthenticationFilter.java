package com.semillero.Finavex.config.jwtConfig;

import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.services.jwt.TokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;
    private final UserR userR;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        //Extract Header authorization of the request
        String authHeader = request.getHeader("Authorization");

        // verify if exists and start with Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Continue with the filter chain
            filterChain.doFilter(request, response);
            return;
        }

        //Extract token
        String token = authHeader.substring(7); // "Bearer " has 7 characters

        // Validate token
        String email= tokenProvider.extractEmail(token);

        if(email != null && SecurityContextHolder.getContext().getAuthentication() == null){
            // Load user from database
            UserDetails user = userDetailsService.loadUserByUsername(email);

            //Validate token with user details
            if(tokenProvider.validateToken(token)){

                //Build authentication
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Save the user in the security context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            // Continue with the filter chain
            filterChain.doFilter(request, response);
        }

    }
}
