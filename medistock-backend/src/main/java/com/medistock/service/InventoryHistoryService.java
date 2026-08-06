package com.medistock.service;

import com.medistock.entity.InventoryHistory;
import com.medistock.repository.InventoryHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryHistoryService {

    @Autowired
    private InventoryHistoryRepository repository;

    public void saveHistory(String medicine,
                            String action,
                            int quantity){

        InventoryHistory history=
                new InventoryHistory(
                        medicine,
                        action,
                        quantity,
                        LocalDateTime.now());

        repository.save(history);

    }

    public List<InventoryHistory> getHistory(){

        return repository.findAll();

    }

}