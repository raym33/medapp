<?php
namespace MedConsult\Admin;

class Settings {
    private $option_group = 'med_consult_options';
    private $option_name = 'med_consult_settings';

    public function init() {
        add_action('admin_menu', [$this, 'add_settings_page']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function add_settings_page() {
        add_options_page(
            'Medical Consultation Settings',
            'Medical Consultation',
            'manage_options',
            'med-consult-settings',
            [$this, 'render_settings_page']
        );
    }

    public function register_settings() {
        register_setting($this->option_group, $this->option_name);

        add_settings_section(
            'api_settings',
            'API Settings',
            [$this, 'render_section_info'],
            'med-consult-settings'
        );

        add_settings_field(
            'openai_api_key',
            'OpenAI API Key',
            [$this, 'render_api_key_field'],
            'med-consult-settings',
            'api_settings',
            ['label_for' => 'openai_api_key']
        );

        add_settings_field(
            'emailjs_settings',
            'EmailJS Settings',
            [$this, 'render_emailjs_fields'],
            'med-consult-settings',
            'api_settings'
        );
    }

    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields($this->option_group);
                do_settings_sections('med-consult-settings');
                submit_button('Save Settings');
                ?>
            </form>
        </div>
        <?php
    }

    public function render_section_info() {
        echo '<p>Configure your API settings for the Medical Consultation system.</p>';
    }

    public function render_api_key_field() {
        $options = get_option($this->option_name);
        ?>
        <input type="password" 
               id="openai_api_key" 
               name="<?php echo $this->option_name; ?>[openai_api_key]" 
               value="<?php echo esc_attr($options['openai_api_key'] ?? ''); ?>" 
               class="regular-text">
        <?php
    }

    public function render_emailjs_fields() {
        $options = get_option($this->option_name);
        ?>
        <p>
            <label>Service ID:<br>
                <input type="text" 
                       name="<?php echo $this->option_name; ?>[emailjs_service_id]" 
                       value="<?php echo esc_attr($options['emailjs_service_id'] ?? ''); ?>" 
                       class="regular-text">
            </label>
        </p>
        <p>
            <label>Template ID:<br>
                <input type="text" 
                       name="<?php echo $this->option_name; ?>[emailjs_template_id]" 
                       value="<?php echo esc_attr($options['emailjs_template_id'] ?? ''); ?>" 
                       class="regular-text">
            </label>
        </p>
        <p>
            <label>Public Key:<br>
                <input type="text" 
                       name="<?php echo $this->option_name; ?>[emailjs_public_key]" 
                       value="<?php echo esc_attr($options['emailjs_public_key'] ?? ''); ?>" 
                       class="regular-text">
            </label>
        </p>
        <?php
    }
}