package com.medistock.demo.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medistock.demo.entity.*;
import com.medistock.demo.repository.*;


@Service
public class PharmacistService {


@Autowired
private MedicineRepository medicineRepository;


@Autowired
private SaleRepository saleRepository;



public void sellMedicine(
Long medicineId,
Integer quantity
){



Medicine medicine =
medicineRepository.findById(medicineId)
.orElseThrow();



if(medicine.getQuantity() < quantity){

throw new RuntimeException(
"Insufficient Stock"
);

}



medicine.setQuantity(
medicine.getQuantity()-quantity
);



medicineRepository.save(medicine);




Sale sale=new Sale();


sale.setMedicine(medicine);


sale.setQuantity(quantity);


sale.setTotalAmount(
medicine.getSellingPrice()*quantity
);



saleRepository.save(sale);



}


}