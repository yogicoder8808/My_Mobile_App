package com.project.mobileApp.service;

import com.project.mobileApp.model.Order;
import com.project.mobileApp.model.User;
import com.project.mobileApp.repository.UserRepository;
import com.project.mobileApp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentService paymentService;

    public Order createOrder(Long userId, Long amount) {
        // Create PaymentIntent
        try {
            paymentService.createPaymentIntent(amount);
        } catch (Exception e) {
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }

        User user = userRepository.findById(userId).orElseThrow();
        Order order = new Order();
        order.setUser(user);
        order.setOrderItems(new ArrayList<>(user.getCart()));
        order.setOrderDate(LocalDateTime.now());

        orderRepository.save(order);
        user.getCart().clear();
        userRepository.save(user);

        return order;
    }
    public boolean userExists(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.isPresent();
    }
}

