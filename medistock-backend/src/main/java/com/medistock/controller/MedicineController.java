package com.medistock.controller;

import com.medistock.entity.Medicine;
import com.medistock.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import com.medistock.util.ExcelGenerator;
import com.medistock.util.PdfGenerator;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin("*")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine){
        return medicineService.addMedicine(medicine);
    }

    @GetMapping
    public List<Medicine> getAllMedicines(){
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{id}")
    public Medicine getMedicine(@PathVariable Long id){
        return medicineService.getMedicine(id);
    }

    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id,
                                   @RequestBody Medicine medicine){
        return medicineService.updateMedicine(id, medicine);
    }

    @DeleteMapping("/{id}")
    public String deleteMedicine(@PathVariable Long id){
        medicineService.deleteMedicine(id);
        return "Medicine Deleted Successfully";
    }

    @GetMapping("/search")
    public List<Medicine> searchMedicine(@RequestParam String name){
        return medicineService.searchMedicine(name);
    }
    @GetMapping("/low-stock")
    public List<Medicine> getLowStockMedicines() {
        return medicineService.getLowStockMedicines();
    }

    @GetMapping("/expired")
    public List<Medicine> getExpiredMedicines() {
        return medicineService.getExpiredMedicines();
    }
    @GetMapping("/out-of-stock")
public List<Medicine> getOutOfStockMedicines() {

    return medicineService.getOutOfStockMedicines();

}
@GetMapping("/near-expiry")
public List<Medicine> getNearExpiryMedicines() {

    return medicineService.getNearExpiryMedicines();

}
@GetMapping("/search/category")
public List<Medicine> searchByCategory(@RequestParam String category) {
    return medicineService.searchByCategory(category);
}
@GetMapping("/search/batch")
public List<Medicine> searchByBatch(@RequestParam String batch) {
    return medicineService.searchByBatch(batch);
}
@GetMapping("/search/expiry")
public List<Medicine> searchByExpiry(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate expiryDate) {

    return medicineService.searchByExpiry(expiryDate);
}
@GetMapping("/count")
public long getMedicineCount() {
    return medicineService.getAllMedicines().size();
}
@GetMapping("/excel")
public void exportExcel(
        HttpServletResponse response)
        throws Exception{

    response.setContentType(
            "application/octet-stream");

    response.setHeader(

            "Content-Disposition",

            "attachment; filename=Medicines.xlsx"

    );

    ExcelGenerator.generateExcel(

            medicineService.getAllMedicines(),

            response

    );

}
@GetMapping("/pdf")
public void exportPdf(HttpServletResponse response)
        throws Exception {

    response.setContentType("application/pdf");

    response.setHeader(
            "Content-Disposition",
            "attachment; filename=Medicines.pdf"
    );

    PdfGenerator.generate(
            medicineService.getAllMedicines(),
            response
    );
}
}   