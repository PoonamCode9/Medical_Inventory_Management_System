package com.medicalinventory.service;

import com.medicalinventory.entity.Medicine;

public interface NotificationService {

    void checkLowStockAndNotify(Medicine medicine);

    void checkExpiryAndNotify();

    void checkExpiryForMedicine(Medicine medicine);

}