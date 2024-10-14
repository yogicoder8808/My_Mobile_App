package com.project.mobileApp.controller;

import com.project.mobileApp.dto.CheckoutRequest;
import com.project.mobileApp.model.Order;
import com.project.mobileApp.service.OrderService;
import com.project.mobileApp.service.PaymentService;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/checkout")
public class CheckoutController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createCheckoutSession(@RequestBody CheckoutRequest request) {
        Long userId = request.getUserId();
        Long amount = Long.valueOf(request.getAmount());

        System.out.println("User ID: " + userId);
        System.out.println("Amount: " + amount);

        try {
            if (userId == null || !orderService.userExists(userId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "User not found"));
            }

            PaymentIntent paymentIntent = paymentService.createPaymentIntent(amount);
            String clientSecret = paymentIntent.getClientSecret();

            Order order = orderService.createOrder(userId, amount);

            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", clientSecret);
            response.put("orderId", order.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
