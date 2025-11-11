package com.semillero.Finavex.controllers.Users;

import com.semillero.Finavex.Validated.Create;
import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.model.User;
import com.semillero.Finavex.services.Users.RegistryServ;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Users")
@RequiredArgsConstructor
@Validated
public class Registry {
    private final RegistryServ registryServ;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody User user){
        return registryServ.registerUser(user);
    }

}
