package com.project.mobileApp.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CheckoutRequest {
    private Long userId;
    private long amount;

}

