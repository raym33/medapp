<?php
/**
 * Plugin Name: Medical Consultation System
 * Description: A medical consultation system with AI-powered analysis and reporting
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 */

defined('ABSPATH') || exit;

// Plugin constants
define('MED_CONSULT_PATH', plugin_dir_path(__FILE__));
define('MED_CONSULT_URL', plugin_dir_url(__FILE__));
define('MED_CONSULT_VERSION', '1.0.0');

// Initialize plugin
function med_consult_init() {
    // Register shortcode
    add_shortcode('medical_consultation', 'med_consult_render_app');
    
    // Register scripts and styles
    add_action('wp_enqueue_scripts', 'med_consult_enqueue_assets');
}
add_action('plugins_loaded', 'med_consult_init');

// Render React app container
function med_consult_render_app() {
    return '<div id="medical-consultation-root"></div>';
}

// Enqueue necessary assets
function med_consult_enqueue_assets() {
    wp_enqueue_script(
        'medical-consultation',
        MED_CONSULT_URL . 'build/index.js',
        ['wp-element'],
        MED_CONSULT_VERSION,
        true
    );

    wp_localize_script('medical-consultation', 'medConsultSettings', [
        'apiUrl' => rest_url('med-consult/v1'),
        'nonce' => wp_create_nonce('wp_rest'),
        'openaiKey' => get_option('med_consult_openai_key')
    ]);

    wp_enqueue_style(
        'medical-consultation',
        MED_CONSULT_URL . 'build/index.css',
        [],
        MED_CONSULT_VERSION
    );
}

// Register REST API endpoints
require_once MED_CONSULT_PATH . 'includes/api.php';