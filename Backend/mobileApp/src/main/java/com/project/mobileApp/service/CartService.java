
package com.project.mobileApp.service;

import com.project.mobileApp.dto.CartItemRequest;
import com.project.mobileApp.model.CartItem;
import com.project.mobileApp.model.Product;
import com.project.mobileApp.model.User;
import com.project.mobileApp.repository.CartRepository;
import com.project.mobileApp.repository.ProductRepository;
import com.project.mobileApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    public List<CartItem> getCart(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public Product addToCart(CartItemRequest cartItemRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(cartItemRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        System.out.println("Adding product to cart: " + product.getName() + " (ID: " + product.getId() + ")");

        List<CartItem> existingCartItems = cartRepository.findByUserId(user.getId());
        for (CartItem cartItem : existingCartItems) {
            if (cartItem.getProduct().getId().equals(product.getId())) {
                cartItem.setQuantity(cartItem.getQuantity() + cartItemRequest.getQuantity());
                cartRepository.save(cartItem);
                return product;
            }
        }

        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(cartItemRequest.getQuantity());
        cartItem.setUser(user);

        System.out.println("Creating new cart item for product: " + product.getName() + " (ID: " + product.getId() + ")");
        cartRepository.save(cartItem);

        return product;
    }

    public void removeFromCart(Long userId, Long cartItemId) {
        User user = userRepository.findById(userId).orElseThrow();

        CartItem cartItemToRemove = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));

        if (!cartItemToRemove.getUser().getId().equals(userId)) {
            throw new RuntimeException("You cannot delete this item from another user's cart");
        }

        cartRepository.delete(cartItemToRemove);
    }


    public void clearCart(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.getCart().clear();
        userRepository.save(user);
    }

    public CartItem updateCartItemQuantity(Long userId, Long itemId, int newQuantity) {
        CartItem cartItem = cartRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItem.setQuantity(newQuantity);

        return cartRepository.save(cartItem);
    }
}
