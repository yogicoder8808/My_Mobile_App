package com.project.mobileApp.controller;

import com.project.mobileApp.model.Product;
import com.project.mobileApp.model.User;
import com.project.mobileApp.service.CartService;
import com.project.mobileApp.service.ProductService;
import com.project.mobileApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {

    @Autowired
    private UserService userService;
    @Autowired
    private CartService cartService;
    @Autowired
    private ProductService productService;

    @GetMapping("/{username}")
    public ResponseEntity<Map<String, Object>> getCustomerDetails(@PathVariable String username) {
        User user = userService.findByUsername(username);


        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("cart", cartService.getCart(user.getId()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
}

