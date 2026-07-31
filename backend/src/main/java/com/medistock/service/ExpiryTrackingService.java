package com.medistock.service;

import java.util.List;
import com.medistock.entity.ExpiryTracking;

public interface ExpiryTrackingService {

    ExpiryTracking addExpiryTracking(ExpiryTracking expiryTracking);

    List<ExpiryTracking> getAllExpiryTracking();

    ExpiryTracking getExpiryTrackingById(Long id);

    ExpiryTracking updateExpiryTracking(Long id, ExpiryTracking expiryTracking);

    void deleteExpiryTracking(Long id);
}