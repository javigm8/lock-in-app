package com.lockin.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Clave secreta para firmar el token
    private final String SECRET = "lockin-secret-key-super-segura-2026-backend";
    // en ms, 24 horas
    private final long EXPIRATION_TIME = 86400000;

    // Convierte SECRET en una clave encriptada que la librería JWT entiende
    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // Crea el token JWT con el nombre de usuario dentro, fecha de creación y fecha de expiración
    // Firmado con la clave secreta encriptada
    public String generateToken(String usuario) {
        return Jwts.builder()
                .subject(usuario)
                .issuedAt(new Date()) // Guarda la fecha actual como fecha de creación
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getKey())
                .compact(); // Genera el token como final String
    }

    // Abre el token y extrae el nombre de usuario que lleva dentro
    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) getKey()) // Verifica que la firma es correcta con la clave
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Comprueba si el token es válido y no ha expirado
    public boolean validateToken(String token) {
        try {
            extractUsername(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
