package com.medistock.backend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChatbotService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public String askAI(String question) {

        String prompt = """
                You are an AI assistant for a Pharmacy Management System called MediStock.

                Rules:
                - Answer ONLY pharmacy and medicine related questions.
                - Explain medicines, dosage, side effects, precautions, storage and first aid.
                - Never diagnose diseases.
                - Never prescribe medicines.
                - If asked to diagnose, politely tell the user to consult a doctor.
                - Keep answers under 150 words.
                - Use simple language.

                User Question:
                """ + question;

        try {

            String json = """
                    {
                      "contents": [
                        {
                          "parts": [
                            {
                              "text": %s
                            }
                          ]
                        }
                      ]
                    }
                    """.formatted(mapper.writeValueAsString(prompt));

            HttpRequest request = HttpRequest.newBuilder()
              .uri(URI.create(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key="
                + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Gemini STATUS = " + response.statusCode());
            System.out.println("Gemini RESPONSE = " + response.body());

            if (response.statusCode() != 200) {
                return "Gemini Error: " + response.body();
            }

            JsonNode root = mapper.readTree(response.body());

            JsonNode candidates = root.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                return "Sorry, I couldn't generate an answer.";
            }

            JsonNode text = candidates
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            if (text.isMissingNode()) {
                return "Sorry, I couldn't understand the AI response.";
            }

            return text.asText();

        } catch (Exception e) {

            e.printStackTrace();

            return "Sorry, I couldn't answer right now.";
        }
    }
}