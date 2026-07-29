package com.medistock.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class OtpService {

    @Value("${fast2sms.api.key}")
    private String apiKey;

    // Temporary OTP storage
    private final Map<String, String> otpStorage = new HashMap<>();


    // ================= GENERATE OTP =================
    public String generateOtp(String phone) {

        String otp = String.valueOf(
                (int) (Math.random() * 900000) + 100000
        );

        otpStorage.put(phone, otp);

        sendSms(phone, otp);

        System.out.println(
                "Generated OTP for " + phone + " = " + otp
        );

        return otp;
    }


    // ================= SEND SMS =================
    private void sendSms(String phone, String otp) {

        try {

            String url = "https://www.fast2sms.com/dev/bulkV2";


            RestTemplate restTemplate = new RestTemplate();


            HttpHeaders headers = new HttpHeaders();

            headers.set(
                    "authorization",
                    apiKey
            );

            headers.setContentType(
                    MediaType.APPLICATION_FORM_URLENCODED
            );


            MultiValueMap<String, String> body =
                    new LinkedMultiValueMap<>();


            body.add(
                    "route",
                    "otp"
            );

            body.add(
                    "variables_values",
                    otp
            );

            body.add(
                    "numbers",
                    phone
            );


            HttpEntity<MultiValueMap<String, String>> request =
                    new HttpEntity<>(body, headers);



            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            url,
                            request,
                            String.class
                    );


            // IMPORTANT: Print Fast2SMS response
            System.out.println(
                    "Fast2SMS Status: "
                    + response.getStatusCode()
            );


            System.out.println(
                    "Fast2SMS Response: "
                    + response.getBody()
            );


            System.out.println(
                    "OTP SMS request completed for: "
                    + phone
            );


        } catch (Exception e) {


            System.out.println(
                    "SMS sending failed: "
                    + e.getMessage()
            );

        }

    }



    // ================= VERIFY OTP =================
    public boolean verifyOtp(
            String phone,
            String otp
    ) {

        String storedOtp = otpStorage.get(phone);


        if (storedOtp == null) {

            return false;

        }


        return storedOtp.equals(otp);

    }



    // ================= CLEAR OTP =================
    public void clearOtp(String phone) {

        otpStorage.remove(phone);

    }

}