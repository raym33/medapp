<?php
namespace MedConsult\Services;

class OpenAIService {
    private $api_key;

    public function __construct() {
        $this->api_key = get_option('med_consult_openai_key');
    }

    public function transcribeAudio($audio_data) {
        $response = wp_remote_post('https://api.openai.com/v1/audio/transcriptions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->api_key,
            ],
            'body' => [
                'file' => $audio_data,
                'model' => 'whisper-1',
                'language' => 'es'
            ]
        ]);

        if (is_wp_error($response)) {
            throw new \Exception('Failed to transcribe audio: ' . $response->get_error_message());
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        return $body['text'] ?? '';
    }

    public function analyzeTranscription($transcription) {
        $response = wp_remote_post('https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode([
                'model' => 'gpt-4',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a medical expert analyzing patient symptoms.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $transcription
                    ]
                ]
            ])
        ]);

        if (is_wp_error($response)) {
            throw new \Exception('Failed to analyze transcription: ' . $response->get_error_message());
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        return $body['choices'][0]['message']['content'] ?? '';
    }
}