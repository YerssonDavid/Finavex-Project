package com.semillero.Finavex.controllers.Users;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.services.Users.RegistryServ;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
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
    @Operation(
            summary="Register a new user",
            description = "Endpoint to register a new user in the application",
            method = "POST",
            tags = {"Registry new users"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User object that needs to be registered",
                    content = @Content (
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = User.class)
                    ),
                    required = true
            )
    )
    public ResponseEntity<ApiResponse<User>> registerUser(@Valid @RequestBody User user){
        return registryServ.registerUser(user);
    }
}
