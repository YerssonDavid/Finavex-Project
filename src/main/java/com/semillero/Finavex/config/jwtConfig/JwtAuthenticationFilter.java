package com.semillero.Finavex.config.jwtConfig;

import com.semillero.Finavex.repository.UserR;
import com.semillero.Finavex.services.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;
    private final UserR userR;
    
}
