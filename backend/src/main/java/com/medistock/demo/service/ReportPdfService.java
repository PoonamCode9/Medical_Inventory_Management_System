package com.medistock.demo.service;


import com.medistock.demo.entity.Medicine;
import com.medistock.demo.repository.MedicineRepository;


import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;


import org.springframework.stereotype.Service;


import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;



@Service
public class ReportPdfService {



    private final MedicineRepository medicineRepository;



    public ReportPdfService(
            MedicineRepository medicineRepository
    ){

        this.medicineRepository = medicineRepository;

    }





    public byte[] generateInventoryReport(){


        try {


            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();



            Document document =
                    new Document();



            PdfWriter.getInstance(
                    document,
                    outputStream
            );



            document.open();



            Font titleFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            20
                    );



            document.add(
                    new Paragraph(
                            "MediStock Inventory Report",
                            titleFont
                    )
            );



            document.add(
                    new Paragraph(
                            "Generated Date : "
                            + LocalDate.now()
                    )
            );


            document.add(
                    new Paragraph(" ")
            );





            // =========================
            // INVENTORY SECTION
            // =========================


            document.add(
                    new Paragraph(
                            "Inventory Details",
                            FontFactory.getFont(
                                    FontFactory.HELVETICA_BOLD,
                                    14
                            )
                    )
            );



            PdfPTable inventoryTable =
                    new PdfPTable(5);



            inventoryTable.setWidthPercentage(100);



            inventoryTable.addCell("ID");
            inventoryTable.addCell("Medicine");
            inventoryTable.addCell("Batch");
            inventoryTable.addCell("Quantity");
            inventoryTable.addCell("Expiry Date");




            List<Medicine> medicines =
                    medicineRepository.findAll();




            for(Medicine medicine : medicines){


                inventoryTable.addCell(
                        String.valueOf(
                                medicine.getId()
                        )
                );


                inventoryTable.addCell(
                        medicine.getName()
                );


                inventoryTable.addCell(
                        medicine.getBatchNumber()
                );


                inventoryTable.addCell(
                        String.valueOf(
                                medicine.getQuantity()
                        )
                );


                inventoryTable.addCell(

                        medicine.getExpiryDate()!=null
                        ?
                        medicine.getExpiryDate().toString()
                        :
                        "N/A"

                );


            }




            document.add(inventoryTable);



            document.add(
                    new Paragraph(" ")
            );






            // =========================
            // EXPIRY REPORT SECTION
            // =========================


            document.add(
                    new Paragraph(
                            "Expiry Alert Report",
                            FontFactory.getFont(
                                    FontFactory.HELVETICA_BOLD,
                                    14
                            )
                    )
            );




            PdfPTable expiryTable =
                    new PdfPTable(4);



            expiryTable.setWidthPercentage(100);



            expiryTable.addCell("Medicine");

            expiryTable.addCell("Batch");

            expiryTable.addCell("Expiry Date");

            expiryTable.addCell("Status");





            List<Medicine> expiredMedicines =

                    medicineRepository.findByExpiryDateBefore(
                            LocalDate.now()
                    );





            if(expiredMedicines.isEmpty()){


                expiryTable.addCell("No Expired Medicines");

                expiryTable.addCell("-");
                expiryTable.addCell("-");
                expiryTable.addCell("SAFE");


            }
            else{


                for(Medicine medicine : expiredMedicines){


                    expiryTable.addCell(
                            medicine.getName()
                    );


                    expiryTable.addCell(
                            medicine.getBatchNumber()
                    );


                    expiryTable.addCell(
                            medicine.getExpiryDate()
                            .toString()
                    );


                    expiryTable.addCell(
                            "EXPIRED"
                    );


                }


            }




            document.add(expiryTable);




            document.close();



            return outputStream.toByteArray();



        }
        catch(Exception e){


            e.printStackTrace();


            throw new RuntimeException(
                    "PDF generation failed "
                    + e.getMessage()
            );


        }



    }



}