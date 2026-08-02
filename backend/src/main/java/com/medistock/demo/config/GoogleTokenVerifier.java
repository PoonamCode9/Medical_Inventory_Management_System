package com.medistock.demo.config;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import java.util.Collections;



@Component
public class GoogleTokenVerifier {


    @Value("${google.client.id}")
    private String clientId;



    public GoogleIdToken.Payload verify(String token){


        try{


            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(

                            new NetHttpTransport(),

                            JacksonFactory.getDefaultInstance()

                    )
                    .setAudience(
                            Collections.singletonList(clientId)
                    )
                    .build();



            GoogleIdToken googleToken =
                    verifier.verify(token);



            if(googleToken == null){

                throw new RuntimeException(
                        "Invalid Google Token"
                );

            }



            return googleToken.getPayload();



        }
        catch(Exception e){


            throw new RuntimeException(
                    "Google verification failed"
            );


        }


    }


}