    package com.findmyroomie.security;

    import io.jsonwebtoken.*;
    import io.jsonwebtoken.security.Keys;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.stereotype.Component;

    import java.security.Key;
    import java.util.Date;

    @Component
    public class JwtUtil {

        private final Key key;
        private final long expirationMillis;

        public JwtUtil(@Value("${jwt.secret}") String secret,
                       @Value("${jwt.expirationMillis}") long expirationMillis) {
            this.key = Keys.hmacShaKeyFor(secret.getBytes());
            this.expirationMillis = expirationMillis;
        }

        public String generateToken(String subject) {
            Date now = new Date();
            Date exp = new Date(now.getTime() + expirationMillis);
            return Jwts.builder()
                    .setSubject(subject)
                    .setIssuedAt(now)
                    .setExpiration(exp)
                    .signWith(key)
                    .compact();
        }

        public String getSubjectFromToken(String token) {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        }

        public boolean validateToken(String token) {
            try {
                Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
                return true;
            } catch (JwtException | IllegalArgumentException ex) {
                return false;
            }
        }
    }
