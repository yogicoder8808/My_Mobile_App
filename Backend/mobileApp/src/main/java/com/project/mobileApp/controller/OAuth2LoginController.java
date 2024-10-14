package com.project.mobileApp.controller;

import com.project.mobileApp.model.CustomUserDetails;
import com.project.mobileApp.model.User;
import com.project.mobileApp.service.UserService;
import com.project.mobileApp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/login/oauth2")
public class OAuth2LoginController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @GetMapping("/redirect")
    public ResponseEntity<String> oauth2LoginSuccess(@AuthenticationPrincipal OAuth2User oauthUser) {
        Map<String, Object> attributes = oauthUser.getAttributes();

        // Extract email or another unique identifier as username
        String username = null;

        if (attributes.containsKey("email")) {
            username = (String) attributes.get("email");
        } else if (attributes.containsKey("sub")) {
            username = (String) attributes.get("sub");
        } else if (attributes.containsKey("name")) {
            username = (String) attributes.get("name");
        }

        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }

        User existingUser = userService.findByUsername(username);

        if (existingUser == null) {
            // If user does not exist, register the user based on OAuth2 information
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword(""); // OAuth users may not have passwords
            newUser.setRoles(new HashSet<>(Collections.singletonList("ROLE_CUSTOMER"))); // Default role
            userService.register(newUser);
            existingUser = newUser;
        }

        // Create a CustomUserDetails object with user roles and other details
        CustomUserDetails userDetails = new CustomUserDetails(
                existingUser.getId(),
                existingUser.getUsername(),
                "", // OAuth2 login won't use a password
                existingUser.getRoles().stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList())
        );

        // Generate JWT token
        String jwtToken = jwtUtil.generateToken(userDetails);

        // Return JWT token in the response
        return ResponseEntity.ok(jwtToken);
    }
}