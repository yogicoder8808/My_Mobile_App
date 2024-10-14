package com.project.mobileApp.service;

import com.project.mobileApp.exception.ResourceNotFoundException;
import com.project.mobileApp.exception.UsernameAlreadyTakenException;
import com.project.mobileApp.model.CustomUserDetails;
import com.project.mobileApp.model.User;
import com.project.mobileApp.repository.UserRepository;
import com.project.mobileApp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }


    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UsernameAlreadyTakenException("Username is already taken!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(new HashSet<>(Collections.singletonList("ROLE_CUSTOMER")));
        }

        return userRepository.save(user);
    }



    public String login(User user) {
        User existingUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            CustomUserDetails userDetails = new CustomUserDetails(
                    existingUser.getId(), // Add user ID
                    existingUser.getUsername(),
                    existingUser.getPassword(),
                    existingUser.getRoles().stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList())
            );

            return jwtUtil.generateToken(userDetails);
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }
    public User registerOrLoginWithFacebook(String facebookId, String name, String email) {
        Optional<User> userOptional = userRepository.findByFacebookId(facebookId);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            user = new User();
            user.setFacebookId(facebookId);
            user.setName(name);
            user.setEmail(email);
            user.setUsername(name);
            user.setRoles(Set.of("ROLE_CUSTOMER"));
            userRepository.save(user);
        }
        return user;
    }
}
