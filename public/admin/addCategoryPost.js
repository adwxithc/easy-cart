

//post new categor to server
document.getElementById('addCategoryForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const categoryName= document.getElementById('addCategoryForm').categoryName.value
    const categoryDescription= document.getElementById('addCategoryForm').categoryDescription.value
    // const metaTitle= document.getElementById('addCategoryForm').metaTitle.value
    // const metaDescription= document.getElementById('addCategoryForm').metaDescription.value
    // const keywords= document.getElementById('addCategoryForm').keywords.value

    
    
    // Create a FormData object to collect form data
    const formData = {
        categoryName,
        categoryDescription,
    };
    
    const jsonData=JSON.stringify(formData)
    

    console.log(formData)
    // Send a POST request to the server using the Fetch API
    fetch('/admin/addCategory', {
        method: 'POST',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json' // Set the Content-Type header
        }
    })
    .then(response => response.json())
    .then(data => {
        
        if(data.success) document.getElementById('addCategoryForm').reset();

        // Handle the response from the server
        document.getElementById('adCategoryalert').textContent = data.message;

        document.getElementById('addCategoryForm').scrollIntoView({
            behavior: 'smooth', // You can use 'auto' for instant scrolling
            block: 'start' // Scroll to the top of the form
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

