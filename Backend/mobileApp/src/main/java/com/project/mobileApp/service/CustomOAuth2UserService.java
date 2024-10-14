package com.project.mobileApp.service;

import com.project.mobileApp.model.User;
import com.project.mobileApp.repository.UserRepository;
import com.project.mobileApp.security.CustomOAuth2User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String facebookId = oauth2User.getAttribute("id");
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        User user = userRepository.findByFacebookId(facebookId)
                .orElseGet(() -> registerNewUser(facebookId, email, name));

        return new CustomOAuth2User(oauth2User);
    }

    private User registerNewUser(String facebookId, String email, String name) {
        User newUser = new User();
        newUser.setFacebookId(facebookId);
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setUsername(name);
        newUser.setRoles(Collections.singleton("ROLE_CUSTOMER"));
        return userRepository.save(newUser);
    }

}
