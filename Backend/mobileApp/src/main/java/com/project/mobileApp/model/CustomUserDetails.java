package com.project.mobileApp.model;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {
    private Long id; // User ID
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

}
