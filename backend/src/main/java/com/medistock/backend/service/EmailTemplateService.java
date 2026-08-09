package com.medistock.backend.service;

import org.springframework.stereotype.Service;

@Service
public class EmailTemplateService {

    public String buildTemplate(String title, String content) {

        return """
        <html>

        <body style="margin:0;
                     padding:40px;
                     background:#f4f6f9;
                     font-family:Arial,sans-serif;">

        <div style="
            max-width:700px;
            margin:auto;
            background:white;
            border-radius:12px;
            overflow:hidden;
            box-shadow:0 5px 18px rgba(0,0,0,.15);
        ">

        <div style="
            background:#1976d2;
            color:white;
            padding:25px;
            text-align:center;
        ">

        <h1>🏥 MediStock</h1>

        <p>Pharmacy Management System</p>

        </div>

        <div style="padding:35px;">

        <h2>%s</h2>

        %s

        </div>

        <div style="
            background:#eeeeee;
            padding:18px;
            text-align:center;
            color:#666;
            font-size:13px;
        ">

        © 2026 MediStock

        </div>

        </div>

        </body>

        </html>
        """.formatted(title, content);

    }

}