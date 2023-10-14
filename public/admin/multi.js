function showOptions() {
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer.style.display === 'block') {
        optionsContainer.style.display = 'none';
    } else {
        optionsContainer.style.display = 'block';
    }
}

const optionInputs = document.querySelectorAll('.option-input');
const selectedOptions = document.querySelector('.selected-options');

optionInputs.forEach((input) => {
    input.addEventListener('change', function () {
        const selected = Array.from(optionInputs)
            .filter((input) => input.checked)
            .map((input) => input.value);
        selectedOptions.textContent = selected.length > 0 ? selected.join(', ') : 'Select options';
    });
});


//imge upload

const imageUploadInput = document.getElementById('image-upload');
const imagePreviewContainer = document.getElementById('image-preview');

imageUploadInput.addEventListener('change', (event) => {
    imagePreviewContainer.innerHTML = ''; // Clear previous previews

    const selectedImages = event.target.files;
    if (selectedImages.length > 4) {
        alert('You can select a maximum of 4 images.');
        imageUploadInput.value = ''; // Clear the input field
        return;
    }

    for (let i = 0; i < selectedImages.length; i++) {
        const image = document.createElement('img');
        image.src = URL.createObjectURL(selectedImages[i]);
        image.classList.add('image-preview');
        imagePreviewContainer.appendChild(image);
    }
});
