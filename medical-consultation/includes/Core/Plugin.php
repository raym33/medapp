<?php
namespace MedConsult\Core;

class Plugin {
    public function __construct() {
        $this->init_hooks();
    }

    private function init_hooks() {
        add_action('init', [$this, 'register_post_types']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
    }

    public function register_post_types() {
        register_post_type('medical_consultation', [
            'labels' => [
                'name' => __('Consultations', 'medical-consultation'),
                'singular_name' => __('Consultation', 'medical-consultation')
            ],
            'public' => true,
            'has_archive' => true,
            'supports' => ['title', 'editor', 'custom-fields'],
            'menu_icon' => 'dashicons-heart'
        ]);
    }

    public function add_admin_menu() {
        add_menu_page(
            __('Medical Consultation', 'medical-consultation'),
            __('Medical Consultation', 'medical-consultation'),
            'manage_options',
            'medical-consultation',
            [$this, 'render_admin_page'],
            'dashicons-heart'
        );
    }

    public function enqueue_scripts() {
        wp_enqueue_style(
            'medical-consultation',
            MED_CONSULT_URL . 'assets/css/style.css',
            [],
            MED_CONSULT_VERSION
        );

        wp_enqueue_script(
            'medical-consultation',
            MED_CONSULT_URL . 'assets/js/app.js',
            ['wp-element', 'wp-api-fetch'],
            MED_CONSULT_VERSION,
            true
        );

        wp_localize_script('medical-consultation', 'medConsultSettings', [
            'apiUrl' => rest_url('med-consult/v1'),
            'nonce' => wp_create_nonce('wp_rest')
        ]);
    }

    public function register_rest_routes() {
        register_rest_route('med-consult/v1', '/consultation', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_consultation'],
            'permission_callback' => function () {
                return current_user_can('read');
            }
        ]);
    }

    public function render_admin_page() {
        require_once MED_CONSULT_PATH . 'templates/admin.php';
    }

    public function handle_consultation($request) {
        $params = $request->get_params();
        $handler = new ConsultationHandler();
        return $handler->process($params);
    }
}