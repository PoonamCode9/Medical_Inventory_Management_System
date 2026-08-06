package com.medistock.service;

import com.medistock.entity.PurchaseOrder;
import com.medistock.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository repository;

    public PurchaseOrder addPurchase(PurchaseOrder order){

        return repository.save(order);

    }

    public List<PurchaseOrder> getPurchases(){

        return repository.findAll();

    }

    public void deletePurchase(Long id){

        repository.deleteById(id);

    }
    public long getPurchaseCount() {
    return repository.count();
}

}