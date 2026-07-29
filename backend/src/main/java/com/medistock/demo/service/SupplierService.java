package com.medistock.demo.service;

import com.medistock.demo.entity.Supplier;
import com.medistock.demo.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {


    private final SupplierRepository supplierRepository;

    private final NotificationService notificationService;



    public SupplierService(
            SupplierRepository supplierRepository,
            NotificationService notificationService
    ){

        this.supplierRepository = supplierRepository;
        this.notificationService = notificationService;

    }





    // ============================
    // ADD SUPPLIER
    // ============================

    public Supplier addSupplier(Supplier supplier) {


        Supplier savedSupplier =
                supplierRepository.save(supplier);



        notificationService.createNotification(

                "Supplier Added",

                savedSupplier.getName()
                + " supplier added successfully",

                "SYSTEM"

        );



        return savedSupplier;

    }







    // ============================
    // GET ALL SUPPLIERS
    // ============================

    public List<Supplier> getAllSuppliers() {

        return supplierRepository.findAll();

    }







    // ============================
    // GET SUPPLIER BY ID
    // ============================

    public Supplier getSupplierById(Long id) {


        return supplierRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found"
                        )
                );

    }







    // ============================
    // UPDATE SUPPLIER
    // ============================

    public Supplier updateSupplier(
            Long id,
            Supplier supplier
    ) {


        Supplier existingSupplier =
                supplierRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found"
                        )
                );



        existingSupplier.setName(
                supplier.getName()
        );


        existingSupplier.setContact(
                supplier.getContact()
        );


        existingSupplier.setEmail(
                supplier.getEmail()
        );


        existingSupplier.setAddress(
                supplier.getAddress()
        );




        Supplier updated =
                supplierRepository.save(
                        existingSupplier
                );




        notificationService.createNotification(

                "Supplier Updated",

                updated.getName()
                + " supplier details updated",

                "SYSTEM"

        );



        return updated;


    }









    // ============================
    // DELETE SUPPLIER
    // ============================

    public void deleteSupplier(Long id) {



        Supplier supplier =
                supplierRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found"
                        )
                );



        String supplierName =
                supplier.getName();



        supplierRepository.delete(
                supplier
        );




        notificationService.createNotification(

                "Supplier Deleted",

                supplierName
                + " supplier removed",

                "SYSTEM"

        );


    }



}