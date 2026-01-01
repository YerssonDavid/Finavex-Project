package com.semillero.Finavex.controllers.Users;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.DtoLogin;
import com.semillero.Finavex.dto.LoginResponse;
import com.semillero.Finavex.services.login.LoginServ;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Users")
@RequiredArgsConstructor
public class Login {
    private final LoginServ loginServ;

    /**
     * Documentation for user login - swagger
     */
    @PostMapping("/login")
    @Operation(
            summary="User login",
            description="Endpoint for user authentication",
            method="POST",
            tags={"User Login"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Login credentials",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = DtoLogin.class)
                    ),
                    required = true
            )
    )
    public ResponseEntity<ApiResponse<LoginResponse>> loginUser(@Valid @RequestBody DtoLogin dtoLogin){
        return loginServ.loginUser(dtoLogin);
    }
}
