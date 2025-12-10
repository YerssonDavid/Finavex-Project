package com.semillero.Finavex.services.jwt;

import com.semillero.Finavex.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class TokenProvider {

    // JWT secret key
    @Value("${jwt.secret}")
    private String jwtSecret;

    // JWT expiration time in milliseconds
    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    // Time expiration for refresh tokens in milliseconds
    @Value("${jwt.refreshExpiration}")
    private Long refreshExpiration;

    //Convert the secret key to key object
    private SecretKey getSingningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate access token
    public String generateToken(User user) {
        //Metadata of user in the Token
        Map<String, Object> claims = new HashMap<>();
        claims.put("Id", user.getId());
        claims.put("Email", user.getEmail());
        claims.put("Type", "Access");

        return buildToken(claims, user.getEmail(), jwtExpiration);
    }

    // Generate Refresh Token
    public String generateRefreshToken(User user){
        Map<String, Object> claims = new HashMap<>();
        claims.put("Id", user.getId());
        claims.put("Type", "Refresh");

        return buildToken(claims, user.getEmail(), refreshExpiration);
    }

    // Build the Token
    private String  buildToken(
            Map<String, Object> claims,
            String subject,
            Long expirationTime
    ) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSingningKey()) //Firma el token con la clave secreta
                .compact();
    }


    // Extract all claims from token
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSingningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //Extract id of the token
    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("Id", Long.class);
    }

    //Extract email of the token
    public String extractEmail (String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("Email", String.class);
    }

    //Extract Expiration Date
    public Date extractExpiration(String token){
        return extractAllClaims(token).getExpiration();
    }

    //Check if the token is expired
    public Boolean isTokenExpiration(String token){
        try{
            return extractExpiration(token).before(new Date());
        } catch(Exception e){
            return true;
        }
    }

    // Validate complete token
    public Boolean validateToken(String token){
        try{
            extractAllClaims(token);
            return !isTokenExpiration(token);
        } catch(Exception e){
            System.err.println("Error validating token: " + e.getMessage());
            return false;
        }
    }
}
