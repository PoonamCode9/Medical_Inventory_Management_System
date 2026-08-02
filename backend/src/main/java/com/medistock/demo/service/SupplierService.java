package com.medistock.demo.service;


import com.medistock.demo.entity.Supplier;
import com.medistock.demo.repository.SupplierRepository;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Locale;



@Service
@Transactional
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







    // =====================================================
    // ADD SUPPLIER
    // =====================================================


    public Supplier addSupplier(
            Supplier supplier
    ){


        validateSupplier(supplier);




        if(
                supplier.getEmail()!=null
                &&
                supplierRepository
                .findAll()
                .stream()
                .anyMatch(existingSupplier ->
                        existingSupplier.getEmail()!=null
                        &&
                        existingSupplier.getEmail()
                                .equalsIgnoreCase(
                                        supplier.getEmail()
                                )
                )
        ){

            throw new RuntimeException(
                    "Supplier email already exists"
            );

        }





        if(supplier.getEmail()!=null){

            supplier.setEmail(
                    supplier.getEmail()
                    .trim()
                    .toLowerCase(Locale.ROOT)
            );

        }






        Supplier saved =

                supplierRepository.save(
                        supplier
                );







        createNotification(

                "Supplier Added",

                saved.getName()
                +
                " supplier added successfully"

        );





        return saved;


    }









    // =====================================================
    // GET ALL SUPPLIERS
    // =====================================================


    @Transactional(readOnly = true)
    public List<Supplier> getAllSuppliers(){


        return supplierRepository.findAll();


    }









    // =====================================================
    // GET SUPPLIER BY ID
    // =====================================================


    @Transactional(readOnly = true)
    public Supplier getSupplierById(
            Long id
    ){


        if(id==null){

            throw new RuntimeException(
                    "Supplier id required"
            );

        }



        return supplierRepository
                .findById(id)

                .orElseThrow(() ->

                        new RuntimeException(
                                "Supplier not found"
                        )

                );


    }









    // =====================================================
    // UPDATE SUPPLIER
    // =====================================================


    public Supplier updateSupplier(

            Long id,

            Supplier supplier

    ){



        Supplier existing =

                getSupplierById(id);




        validateSupplier(supplier);







        existing.setName(

                supplier.getName()
                        .trim()

        );



        existing.setContact(

                supplier.getContact()

        );



        existing.setEmail(

                supplier.getEmail()
                        .trim()
                        .toLowerCase(Locale.ROOT)

        );



        existing.setAddress(

                supplier.getAddress()

        );






        Supplier updated =

                supplierRepository.save(
                        existing
                );






        createNotification(

                "Supplier Updated",

                updated.getName()
                +
                " supplier details updated"

        );






        return updated;



    }









    // =====================================================
    // DELETE SUPPLIER
    // =====================================================


    public void deleteSupplier(

            Long id

    ){



        Supplier supplier =

                getSupplierById(id);




        String name =

                supplier.getName();






        supplierRepository.delete(
                supplier
        );






        createNotification(

                "Supplier Deleted",

                name
                +
                " supplier removed"

        );



    }









    // =====================================================
    // VALIDATION
    // =====================================================


    private void validateSupplier(

            Supplier supplier

    ){



        if(supplier==null){

            throw new RuntimeException(
                    "Supplier data required"
            );

        }





        if(
                supplier.getName()==null
                ||
                supplier.getName().isBlank()

        ){

            throw new RuntimeException(
                    "Supplier name required"
            );

        }







        if(
                supplier.getContact()!=null
                &&
                !supplier.getContact()
                .matches("[0-9]{10}")

        ){

            throw new RuntimeException(
                    "Invalid contact number"
            );

        }







        if(
                supplier.getEmail()!=null
                &&
                !supplier.getEmail()
                .matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
                )

        ){

            throw new RuntimeException(
                    "Invalid email address"
            );

        }



    }









    // =====================================================
    // NOTIFICATION HELPER
    // =====================================================


    private void createNotification(

            String title,

            String message

    ){


        try {


            notificationService.createNotification(

                    title,

                    message,

                    "SYSTEM"

            );


        }
        catch(Exception e){


            System.out.println(
                    "Notification failed : "
                    +
                    e.getMessage()
            );


        }


    }




}