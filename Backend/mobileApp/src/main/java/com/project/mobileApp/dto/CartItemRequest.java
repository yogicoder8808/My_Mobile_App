package com.project.mobileApp.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private Long productId;
    private int quantity;
}
