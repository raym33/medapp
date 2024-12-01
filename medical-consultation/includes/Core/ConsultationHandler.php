<?php
namespace MedConsult\Core;

use MedConsult\Services\OpenAIService;
use MedConsult\Services\EmailService;

class ConsultationHandler {
    private $openai;
    private $email;

    public function __construct() {
        $this->openai = new OpenAIService();
        $this->email = new EmailService();
    }

    public function process($data) {
        try {
            // Process audio if present
            if (!empty($data['audio'])) {
                $transcription = $this->openai->transcribeAudio($data['audio']);
                $analysis = $this->openai->analyzeTranscription($transcription);
            }

            // Generate report
            $report = $this->generate_report($data, $transcription ?? '', $analysis ?? '');

            // Save consultation
            $consultation_id = $this->save_consultation($data, $report);

            // Send email if requested
            if (!empty($data['doctor_email'])) {
                $this->email->send_report($data['doctor_email'], $report);
            }

            return [
                'success' => true,
                'consultation_id' => $consultation_id,
                'report' => $report
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function generate_report($data, $transcription, $analysis) {
        return [
            'patient_info' => $data,
            'transcription' => $transcription,
            'analysis' => $analysis,
            'generated_at' => current_time('mysql')
        ];
    }

    private function save_consultation($data, $report) {
        $post_data = [
            'post_title' => $data['name'],
            'post_type' => 'medical_consultation',
            'post_status' => 'publish',
            'meta_input' => [
                '_consultation_data' => $data,
                '_consultation_report' => $report
            ]
        ];

        return wp_insert_post($post_data);
    }
}