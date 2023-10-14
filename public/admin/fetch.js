var pageContent = document.getElementById('pageContent');



document.getElementById('sideNavBar').addEventListener("click",(e)=>{
    
   
    if(e.target.classList.contains('adminOption')){
        
        
        if(e.target.id=='view-categoryAnchor'){

            // view category


                const pageUrl = '/admin/viewCategory';

                fetch(pageUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    // Update the pageContent div with the loaded HTML
                    pageContent.innerHTML = html;

                    const scriptSrc='/static/admin/viewCategoryPagination.js'
                    const scriptexist=document.querySelector(`script[src="${scriptSrc}"]`)

                    if(scriptexist){
                        scriptexist.parentNode.removeChild(scriptexist);
                    }


                    const script2=document.createElement('script');
                    script2.src=scriptSrc;
                    document.body.appendChild(script2);

                    

                    

                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        



        

        //if closed  
    
        }else if(e.target.id =='add-categoryAnchor'){

        
            // add category

                
                // Specify the URL of the page you want to load
                const pageUrl = '/admin/addCategory';

                fetch(pageUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(html => {
                        // Update the pageContent div with the loaded HTML
                        pageContent.innerHTML = html;


                        const scriptSrc='/static/admin/addCategoryPost.js'
                        const scriptexist=document.querySelector(`script[src="${scriptSrc}"]`)

                        if(scriptexist){
                            scriptexist.parentNode.removeChild(scriptexist);
                        }

                        const script=document.createElement('script');
                        script.src=scriptSrc;
                        document.body.appendChild(script);
                        
                        

                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                    });
            


        }else if(e.target.id =='view-userAnchor'|| e.target.id =='view-span'){

                    
            //view users

            function viewUsers(){
                
                    // Specify the URL of the page you want to load
                    const pageUrl = '/admin/loadUsers';
                
                    fetch(pageUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.text();
                        })
                        .then(html => {
                            // Update the pageContent div with the loaded HTML
                            pageContent.innerHTML = html;
                            
                            const scriptSrc='/static/admin/viewUsers.js'
                            const scriptexist=document.querySelector(`script[src="${scriptSrc}"]`)
                
                            if(scriptexist){
                                scriptexist.parentNode.removeChild(scriptexist);
                            }
                
                            const script=document.createElement('script');
                            script.src=scriptSrc;
                            document.body.appendChild(script);
                
                        })
                        .catch(error => {
                            console.error('Fetch error:', error);
                        });
                
                }
                viewUsers()

        }else if(e.target.id =='add-productAnchor'){

//load add product 
            const pageUrl = '/admin/addProduct';

            fetch(pageUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    // Update the pageContent div with the loaded HTML
                    pageContent.innerHTML = html;


                    // const scriptSrc='/static/admin/multi.js'
                    // const scriptexist=document.querySelector(`script[src="${scriptSrc}"]`)

                    // if(!scriptexist){
            
                    // const script=document.createElement('script');
                    // script.src=scriptSrc;
                    // document.body.appendChild(script);
                    // }

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
                    

                    

                    document.getElementById("addProduct").addEventListener('click',()=>{

                             // Create a FormData object to collect form data
                                const formData = {

                                    name:(document.getElementById("name").value),
                                    description:(document.getElementById("description").value),
                                    category:((document.getElementById("categorylist").innerHTML).split(',')),
                                    brand:(document.getElementById("brand").value),
                                    stock:(document.getElementById("stock").value),
                                    price:(document.getElementById("price").value),
                                    stock:(document.getElementById("stock").value),
                                    color:(document.getElementById("color").value),
                                    careInstructions:(document.getElementById("careInstructions").value),
                                    material:(document.getElementById("material").value),
                                    additionalSpecifications:(document.getElementById("additionalSpecifications").value)
                                };
                                console.log(formData)
                                
                                const jsonData=JSON.stringify(formData)
                                

                                console.log(formData)
                                // Send a POST request to the server using the Fetch API
                                fetch('/admin/addProduct', {
                                    method: 'POST',
                                    body: jsonData,
                                    headers: {
                                        'Content-Type': 'application/json' // Set the Content-Type header
                                    }
                                })
                                .then(response => response.json())
                                .then(data => {
                                    alert("fetch entered")
                                    if(data.success) document.getElementById('addProductForm').reset();

                                    // Handle the response from the server
                                    document.getElementById('addproductalert').textContent = data.message;

                                    document.getElementById('addProductForm').scrollIntoView({
                                        behavior: 'smooth', // You can use 'auto' for instant scrolling
                                        block: 'start' // Scroll to the top of the form
                                    });
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });

                        
                    })
                
                    
                    

                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
                



        }
    }

},true)












