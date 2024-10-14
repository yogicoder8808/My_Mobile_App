package com.project.mobileApp.security;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

@Data
public class CustomOAuth2User implements OAuth2User {
    private final OAuth2User oauth2User;
    private final String facebookId;
    private final String name;
    private final String email;

    public CustomOAuth2User(OAuth2User oauth2User) {
        this.oauth2User = oauth2User;
        this.facebookId = oauth2User.getAttribute("id");
        this.name = oauth2User.getAttribute("name");
        this.email = oauth2User.getAttribute("email");
    }

    @Override
    public String getName() {
        return oauth2User.getName();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2User.getAuthorities();
    }
}
