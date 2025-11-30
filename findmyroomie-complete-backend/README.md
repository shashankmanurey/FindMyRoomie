# FindMyRoomie - Complete Backend

## Features
- Spring Boot 3.4.11 (Java 17)
- JWT Access + Refresh tokens (jjwt)
- User registration/login, profile
- Post CRUD with pagination
- Real-time chat using WebSocket + STOMP
- CORS config for React frontend
- Swagger (OpenAPI)

## Setup
1. Modify `src/main/resources/application.properties` for your MySQL credentials and `jwt.secret`.
2. Build: `mvn clean package`.
3. Run: `mvn spring-boot:run` or run `FindMyRoomieApplication`.

## Endpoints
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- GET /users/me
- GET /posts?page=0&size=10
- POST /posts
- WebSocket endpoint: /ws (STOMP)

## Notes
- For production, store secrets in environment variables and use HTTPS.
