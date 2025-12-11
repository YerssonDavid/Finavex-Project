package com.semillero.Finavex.services.Users;

import com.semillero.Finavex.repository.UserR;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceJwt implements UserDetailsService {
    private final UserR userR;

    public UserDetailsServiceJwt(UserR userR) {
        this.userR = userR;
    }

    @Override
    public UserDetails loadUserByUsername (String email) throws UsernameNotFoundException {
        return userR.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email"));
    }
}
