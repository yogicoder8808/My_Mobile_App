package com.project.mobileApp.security;

import com.project.mobileApp.model.CustomUserDetails;
import com.project.mobileApp.model.User;
import com.project.mobileApp.service.UserService;
import com.project.mobileApp.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    @Lazy
    private UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauthUser.getAttributes();

        String facebookUsername = null;
        if (attributes.containsKey("name")) {
            facebookUsername = (String) attributes.get("name");
        } else if (attributes.containsKey("id")) {
            facebookUsername = "facebook_" + attributes.get("id");  // Using Facebook id as fallback
        } else if (attributes.containsKey("email")) {
            facebookUsername = (String) attributes.get("email");
        }

        if (facebookUsername == null) {
            throw new IllegalArgumentException("Facebook username cannot be null");
        }

        User user = userService.findByUsername(facebookUsername);
        if (user == null) {
            // Register a new user if not found
            user = new User();
            user.setUsername(facebookUsername);
            user.setFacebookId((String) attributes.get("id"));
            user.setName((String) attributes.get("name"));
            user.setEmail((String) attributes.get("email"));
            user.setRoles(new HashSet<>(Collections.singletonList("ROLE_CUSTOMER")));
            userService.register(user);
        }

        CustomUserDetails userDetails = new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                "",
                user.getRoles().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList())
        );

        String token = jwtUtil.generateToken(userDetails);

        String redirectUrl = "http://localhost:3000/oauth2/redirect?token=" + token;
        response.sendRedirect(redirectUrl);
    }
}
