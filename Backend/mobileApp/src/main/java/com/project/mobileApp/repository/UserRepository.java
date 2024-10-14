package com.project.mobileApp.repository;

import com.project.mobileApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByFacebookId(String facebookId);
//    Optional<User> findByEmail(String email);
boolean existsByUsername(String username);
}
