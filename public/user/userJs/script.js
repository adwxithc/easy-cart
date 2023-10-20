    // Get references to the images and the product preview element
    const thumbnailImages = document.querySelectorAll('.thumbnailImg');
    const productPreview = document.querySelector('.productPreView');
    
    // Add a click event listener to each thumbnail image
    thumbnailImages.forEach((thumbnailImg, index) => {
        thumbnailImg.addEventListener('mouseover', () => {
            // Get the source (src) of the clicked image
            const imageSource = thumbnailImg.getAttribute('src');
    
            // Update the source (src) of the product preview image
            productPreview.setAttribute('src', imageSource);
    
            // Optionally, you can also add a fade-in effect, or any other visual enhancements
            // to improve the user experience when the image changes.
        });
    });