package ro.techvault.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();
    private static final List<String> ADMIN_PATTERNS = List.of("/api/admin/**");

    @Value("${gateway.open-paths:}")
    private String openPathConfig;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private SecretKey secretKey;
    private List<String> openPaths;

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        if (openPathConfig == null || openPathConfig.isBlank()) {
            this.openPaths = new java.util.ArrayList<>();
        } else {
            this.openPaths = new java.util.ArrayList<>(Arrays.stream(openPathConfig.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList());
        }
        this.openPaths.add("/api/vaults/**");
        this.openPaths.add("/api/quests/**");
        this.openPaths.add("/api/vaults");
        this.openPaths.add("/api/quests");
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        HttpMethod method = exchange.getRequest().getMethod();
        if (method == HttpMethod.OPTIONS) {
            // Always allow CORS preflight requests so the framework can add the headers.
            return chain.filter(exchange);
        }

        String path = exchange.getRequest().getURI().getPath();
        System.out.println("Processing request for path: " + path);

        if (path.startsWith("/api/vaults") || path.startsWith("/api/quests")) {
            System.out.println("Path " + path + " is explicitly allowed via startsWith");
            return chain.filter(exchange);
        }

        boolean open = isOpenPath(path);
        System.out.println("Is open path? " + open);
        if (open) {
            return chain.filter(exchange);
        }

        String authorization = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authorization.substring("Bearer ".length());
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String userId = claims.getSubject();
            String role = claims.get("role", String.class);

            if (requiresAdmin(path) && (role == null || !"ADMIN".equalsIgnoreCase(role))) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }

            ServerHttpRequest mutatedRequest = exchange.getRequest()
                    .mutate()
                    .header("X-User-Id", userId)
                    .header("X-User-Role", role == null ? "" : role)
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        } catch (JwtException ex) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    private boolean isOpenPath(String path) {
        if (openPaths == null || openPaths.isEmpty()) {
            return false;
        }
        return openPaths.stream().anyMatch(pattern -> PATH_MATCHER.match(pattern, path));
    }

    private boolean requiresAdmin(String path) {
        return ADMIN_PATTERNS.stream().anyMatch(pattern -> PATH_MATCHER.match(pattern, path));
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
