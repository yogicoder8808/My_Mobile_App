package com.project.mobileApp.controller;

import com.project.mobileApp.dto.CartItemRequest;
import com.project.mobileApp.dto.CartItemResponse;
import com.project.mobileApp.model.CartItem;
import com.project.mobileApp.model.Product;
import com.project.mobileApp.model.User;
import com.project.mobileApp.service.CartService;
import com.project.mobileApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/customer/{username}")
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @GetMapping("/cart")
    public ResponseEntity<Map<String, Object>> getCartDetails(@PathVariable String username) {
        User user = userService.findByUsername(username);
        List<CartItem> cartItems = cartService.getCart(user.getId());

        List<CartItemResponse> cartItemResponses = cartItems.stream()
                .map(cartItem -> new CartItemResponse(cartItem.getId(), cartItem.getProduct(), cartItem.getQuantity()))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("cart", cartItemResponses);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<Product> addToCart(@PathVariable String username, @RequestBody CartItemRequest cartItemRequest) {
        Product addedProduct = cartService.addToCart(cartItemRequest, username);
        return ResponseEntity.ok(addedProduct);
    }

    @DeleteMapping("/remove/{itemId}")
    public void removeFromCart(@PathVariable String username, @PathVariable Long itemId) {
        User user = userService.findByUsername(username);
        cartService.removeFromCart(user.getId(), itemId);
    }

    @PostMapping("/checkout")
    public void checkout(@PathVariable String username) {
        User user = userService.findByUsername(username);
        cartService.clearCart(user.getId());
    }

    @PutMapping("/cart/{itemId}")
    public ResponseEntity<CartItemResponse> updateCartQuantity(
            @PathVariable String username,
            @PathVariable Long itemId,
            @RequestBody CartItemRequest cartItemRequest) {

        User user = userService.findByUsername(username);
        CartItem updatedCartItem = cartService.updateCartItemQuantity(user.getId(), itemId, cartItemRequest.getQuantity());

        CartItemResponse response = new CartItemResponse(updatedCartItem.getId(), updatedCartItem.getProduct(), updatedCartItem.getQuantity());
        return ResponseEntity.ok(response);
    }

}
