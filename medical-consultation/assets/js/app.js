document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('consultationForm');
    let mediaRecorder;
    let audioChunks = [];

    // Audio recording setup
    document.getElementById('startRecording').addEventListener('click', async function() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('audioPreview').src = audioUrl;
                document.getElementById('audioPreview').style.display = 'block';
            };

            mediaRecorder.start();
            this.style.display = 'none';
            document.getElementById('stopRecording').style.display = 'block';
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Error accessing microphone. Please ensure microphone permissions are granted.');
        }
    });

    document.getElementById('stopRecording').addEventListener('click', function() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            this.style.display = 'none';
            document.getElementById('startRecording').style.display = 'block';
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        if (audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            formData.append('audio', audioBlob);
        }

        try {
            const response = await fetch(medConsultSettings.apiUrl + '/consultation', {
                method: 'POST',
                headers: {
                    'X-WP-Nonce': medConsultSettings.nonce
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert('Consultation submitted successfully!');
                form.reset();
                audioChunks = [];
                document.getElementById('audioPreview').style.display = 'none';
            } else {
                alert('Error: ' + (result.error || 'Unknown error occurred'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    });
});