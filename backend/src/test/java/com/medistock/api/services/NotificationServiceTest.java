package com.medistock.api.services;

import com.medistock.api.models.*;
import com.medistock.api.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock private NotificationRepository notificationRepository;
    @Mock private UserRepository userRepository;
    @Mock private MedicineRepository medicineRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User adminUser;
    private Notification notification;

    @BeforeEach
    void setUp() {
        adminUser = new User("admin", "pass", "admin@test.com", UserRole.ADMIN);
        adminUser.setId(1L);

        notification = new Notification();
        notification.setId(1L);
        notification.setUser(adminUser);
        notification.setMessage("Low stock");
    }

    @Test
    void testMarkAsRead_wrongUser_throwsException() {
        User otherUser = new User("staff", "pass", "staff@test.com", UserRole.STAFF);
        otherUser.setId(2L);
        
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(userRepository.findByUsername("staff")).thenReturn(Optional.of(otherUser));

        assertThrows(RuntimeException.class, () -> notificationService.markAsRead(1L, "staff"));
        verify(notificationRepository, never()).save(any());
    }

    @Test
    void testGenerateNotifications_deduplicates() {
        when(userRepository.findAll()).thenReturn(Collections.singletonList(adminUser));
        
        Medicine med = new Medicine();
        med.setName("TestMed");
        med.setQuantity(5);
        when(medicineRepository.findByQuantityLessThanEqual(10)).thenReturn(Collections.singletonList(med));
        when(medicineRepository.findExpiringBetween(any(), any())).thenReturn(new ArrayList<>());
        when(medicineRepository.findByExpiryDateBefore(any())).thenReturn(new ArrayList<>());
        
        when(notificationRepository.existsRecentNotification(eq(adminUser), eq(NotificationType.LOW_STOCK), anyString(), any())).thenReturn(true);
        
        notificationService.generateExpiryAndLowStockNotifications();
        
        verify(notificationRepository, never()).save(any());
    }
}
