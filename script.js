document.addEventListener("DOMContentLoaded", function () {
    const settingIcon = document.getElementById("setting");
    const settingBox = document.getElementById("settingbox");
    const closeBtn = document.getElementById("close");
    const soundButton = document.getElementById("sound");
    const textarea = document.getElementById("textarea");

    // Select Sliders & Dropdown
    const frequencySlider = document.getElementById("frequency");
    const speedSlider = document.getElementById("speed");
    const volumeSlider = document.getElementById("volume");
    const voiceSelect = document.getElementById("voiceSelect");

    let speech = new SpeechSynthesisUtterance();
    let isSpeaking = false;
    let voices = [];

    // Define the voice options we want (Fallback in case of unavailable voices)
    const predefinedVoices = [
        { name: "Female", voice: "Google UK English Female" },
        { name: "Male", voice: "Google UK English Male" },
        { name: "Child", voice: "Google UK English Male" }  // Use Male for Child-like voice
    ];

    // Load the predefined voices into the dropdown
    function loadVoices() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = "";
        
        // Check for each predefined voice and add it to the dropdown if available
        predefinedVoices.forEach((predefinedVoice) => {
            let option = document.createElement("option");
            option.value = predefinedVoice.voice;
            option.textContent = predefinedVoice.name;
            voiceSelect.appendChild(option);
        });

        // Fallback if no predefined voices found
        if (voiceSelect.options.length === 0) {
            const fallbackOption = document.createElement("option");
            fallbackOption.value = "Google UK English Female"; // Fallback to default Female voice
            fallbackOption.textContent = "Female (Default)";
            voiceSelect.appendChild(fallbackOption);
        }
    }

    speechSynthesis.onvoiceschanged = loadVoices;

    // Toggle settings box
    settingIcon.addEventListener("click", function () {
        settingBox.style.display = "block";
    });

    closeBtn.addEventListener("click", function () {
        settingBox.style.display = "none";
    });

    // Update speech settings based on selected voice
    function updateSpeechSettings() {
        const selectedVoice = predefinedVoices.find(v => v.voice === voiceSelect.value);
        if (selectedVoice) {
            speech.voice = voices.find(v => v.name === selectedVoice.voice) || voices[0]; // Fallback to default voice
        }
        speech.pitch = frequencySlider.value / 5;
        speech.rate = speedSlider.value / 5;
        speech.volume = volumeSlider.value / 10;
    }

    // Function to start speech
    function speakText() {
        if (!isSpeaking) {
            speech.text = textarea.value || "Hello, adjust my pitch and speed!";
            updateSpeechSettings();
            speechSynthesis.speak(speech);
            isSpeaking = true;
        }
    }

    // Restart speech when settings change
    function restartSpeech() {
        if (isSpeaking) {
            speechSynthesis.cancel();
            speakText();
        }
    }

    // Click sound button to toggle speech
    soundButton.addEventListener("click", function () {
        if (isSpeaking) {
            speechSynthesis.cancel();
            isSpeaking = false;
        } else {
            speakText();
        }
    });

    // Apply settings live
    frequencySlider.addEventListener("input", restartSpeech);
    speedSlider.addEventListener("input", restartSpeech);
    volumeSlider.addEventListener("input", function () {
        speech.volume = volumeSlider.value / 10;
    });
    voiceSelect.addEventListener("change", restartSpeech);

    // Initial load of voices
    loadVoices();
});
