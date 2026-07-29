package com.medistock.service;

import com.medistock.entity.Supplier;
import com.medistock.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public Supplier addSupplier(Supplier supplier){
        return supplierRepository.save(supplier);
    }

    public List<Supplier> getAllSuppliers(){
        return supplierRepository.findAll();
    }

    public Supplier getSupplier(Long id){
        return supplierRepository.findById(id).orElse(null);
    }

    public Supplier updateSupplier(Long id, Supplier supplier){

        Supplier existing = supplierRepository.findById(id).orElse(null);

        if(existing == null){
            return null;
        }

        existing.setSupplierName(supplier.getSupplierName());
        existing.setContactNumber(supplier.getContactNumber());
        existing.setEmail(supplier.getEmail());
        existing.setAddress(supplier.getAddress());

        return supplierRepository.save(existing);
    }

    public void deleteSupplier(Long id){
        supplierRepository.deleteById(id);
    }

    public List<Supplier> searchSupplier(String name){
        return supplierRepository.findBySupplierNameContainingIgnoreCase(name);
    }

}