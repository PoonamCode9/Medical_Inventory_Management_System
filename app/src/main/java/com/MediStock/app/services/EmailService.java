package com.MediStock.app.services;

import com.MediStock.app.entities.Notification;

import java.util.List;

public interface EmailService {

    void sendInventoryAlert(List<Notification> notifications);

}