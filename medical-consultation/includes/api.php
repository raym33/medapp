<?php
// Register REST API endpoints
add_action('rest_api_init', function () {
    register_rest_route('med-consult/v1', '/consultation', [
        'methods' => 'POST',
        'callback' => 'med_consult_handle_consultation',
        'permission_callback' => function () {
            return current_user_can('read');
        }
    ]);
});

function med_consult_handle_consultation($request) {
    $params = $request->get_params();
    
    try {
        // Process consultation data
        $consultation_id = wp_insert_post([
            'post_type' => 'medical_consultation',
            'post_title' => sanitize_text_field($params['patientName']),
            'post_status' => 'publish',
            'meta_input' => [
                '_patient_data' => $params
            ]
        ]);

        return [
            'success' => true,
            'consultationId' => $consultation_id
        ];
    } catch (Exception $e) {
        return new WP_Error(
            'consultation_error',
            $e->getMessage(),
            ['status' => 500]
        );
    }
}