package com.semillero.Finavex.controllers.Users;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.users.registryUser.RegistryUserDto;
import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.services.Users.RegistryServ;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    /**
     * Documentation for user registration - swagger
    * */
    @PostMapping("/register")
    @Operation(
            summary="Register a new user",
            description = "Creates a new user account in the application",
            method = "POST",
            tags = {"Registry new users"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User registration details",
                    content = @Content (
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = RegistryUserDto.class)
                    ),
                    required = true
            ),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "201",
                            description = "User registered successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ApiResponse.class)
                            )
                    ),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "409",
                            description = "User already exists"
                    )
            }
    )
    public ResponseEntity<ApiResponse<User>> registerUser(@Valid @RequestBody RegistryUserDto registryUserDto){
        ApiResponse<User> registry = registryServ.registerUser(registryUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registry);
    }
}
