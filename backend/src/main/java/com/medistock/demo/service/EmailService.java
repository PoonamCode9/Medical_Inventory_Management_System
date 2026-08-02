package com.medistock.demo.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.stereotype.Service;



@Service
public class EmailService {



    @Autowired
    private JavaMailSender mailSender;




    public void sendEmail(
            String to,
            String subject,
            String medicineName,
            String batchNumber,
            String expiryDate,
            Integer quantity
    ) throws MessagingException {



        MimeMessage message =
                mailSender.createMimeMessage();



        MimeMessageHelper helper =
                new MimeMessageHelper(
                        message,
                        true
                );



        helper.setTo(to);

        helper.setSubject(subject);



        String htmlContent = """

        <!DOCTYPE html>
        <html>

        <head>

        <style>


        body{

            font-family:
            'Segoe UI',
            Arial,
            sans-serif;

            background:#f4f7fb;

            margin:0;

            padding:20px;

        }



        .container{

            max-width:600px;

            margin:auto;

            background:white;

            border-radius:18px;

            overflow:hidden;

            box-shadow:
            0 10px 30px rgba(0,0,0,0.08);

        }



        .header{

            background:
            linear-gradient(
            135deg,
            #2563eb,
            #0ea5e9
            );

            padding:30px;

            color:white;

            text-align:center;

        }



        .header h1{

            margin:0;

            font-size:26px;

        }



        .header p{

            margin-top:8px;

            opacity:0.9;

        }




        .content{

            padding:30px;

        }



        .alert{

            background:#fee2e2;

            color:#b91c1c;

            padding:15px;

            border-radius:12px;

            font-weight:600;

            margin-bottom:20px;

        }



        .card{


            background:#f8fafc;

            border-radius:14px;

            padding:20px;

            border:1px solid #e2e8f0;

        }



        .row{

            display:flex;

            justify-content:space-between;

            padding:10px 0;

            border-bottom:1px solid #e5e7eb;

        }



        .label{

            font-weight:600;

            color:#475569;

        }



        .value{

            color:#0f172a;

            font-weight:700;

        }




        .footer{


            background:#f1f5f9;

            text-align:center;

            padding:18px;

            color:#64748b;

            font-size:13px;

        }



        .danger{

            color:#dc2626;

        }


        </style>

        </head>




        <body>


        <div class="container">



        <div class="header">

            <h1>
            💊 MediStock
            </h1>

            <p>
            Medical Inventory Management System
            </p>

        </div>




        <div class="content">


        <div class="alert">

            ⚠️ Expired Medicine Alert

        </div>




        <div class="card">


            <div class="row">

                <span class="label">
                Medicine Name
                </span>

                <span class="value">
                %s
                </span>

            </div>



            <div class="row">

                <span class="label">
                Batch Number
                </span>

                <span class="value">
                %s
                </span>

            </div>




            <div class="row">

                <span class="label">
                Expiry Date
                </span>

                <span class="value danger">
                %s
                </span>

            </div>





            <div class="row">

                <span class="label">
                Quantity
                </span>

                <span class="value">
                %s Units
                </span>

            </div>



        </div>




        <br>


        <p>

        Please remove this expired medicine from inventory
        immediately to maintain medicine safety standards.

        </p>



        </div>




        <div class="footer">

            © 2026 MediStock |
            Smart Medical Inventory System

        </div>



        </div>


        </body>

        </html>

        """.formatted(

                medicineName,
                batchNumber,
                expiryDate,
                quantity

        );




        helper.setText(
                htmlContent,
                true
        );



        mailSender.send(message);


    }


}