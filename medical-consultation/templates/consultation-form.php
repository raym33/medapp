<div id="medical-consultation-form" class="medical-consultation-container">
    <form class="med-consult-form" id="consultationForm">
        <div class="form-section">
            <h3><?php _e('Patient Information', 'medical-consultation'); ?></h3>
            <div class="form-row">
                <label for="patient_name"><?php _e('Full Name', 'medical-consultation'); ?></label>
                <input type="text" id="patient_name" name="name" required>
            </div>
            <div class="form-row">
                <label for="patient_age"><?php _e('Age', 'medical-consultation'); ?></label>
                <input type="number" id="patient_age" name="age" required>
            </div>
            <div class="form-row">
                <label for="patient_gender"><?php _e('Gender', 'medical-consultation'); ?></label>
                <select id="patient_gender" name="gender" required>
                    <option value=""><?php _e('Select...', 'medical-consultation'); ?></option>
                    <option value="male"><?php _e('Male', 'medical-consultation'); ?></option>
                    <option value="female"><?php _e('Female', 'medical-consultation'); ?></option>
                    <option value="other"><?php _e('Other', 'medical-consultation'); ?></option>
                </select>
            </div>
        </div>

        <div class="form-section">
            <h3><?php _e('Symptoms Recording', 'medical-consultation'); ?></h3>
            <div class="audio-recorder">
                <button type="button" id="startRecording">
                    <?php _e('Start Recording', 'medical-consultation'); ?>
                </button>
                <button type="button" id="stopRecording" style="display: none;">
                    <?php _e('Stop Recording', 'medical-consultation'); ?>
                </button>
                <audio id="audioPreview" controls style="display: none;"></audio>
            </div>
        </div>

        <div class="form-section">
            <h3><?php _e('Additional Information', 'medical-consultation'); ?></h3>
            <div class="form-row">
                <label for="current_medication">
                    <?php _e('Current Medication', 'medical-consultation'); ?>
                </label>
                <textarea id="current_medication" name="medication"></textarea>
            </div>
            <div class="form-row">
                <label for="allergies">
                    <?php _e('Allergies', 'medical-consultation'); ?>
                </label>
                <textarea id="allergies" name="allergies"></textarea>
            </div>
        </div>

        <div class="form-section">
            <h3><?php _e('Doctor Information', 'medical-consultation'); ?></h3>
            <div class="form-row">
                <label for="doctor_email">
                    <?php _e('Doctor\'s Email', 'medical-consultation'); ?>
                </label>
                <input type="email" id="doctor_email" name="doctor_email">
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="submit-button">
                <?php _e('Submit Consultation', 'medical-consultation'); ?>
            </button>
        </div>
    </form>
</div>