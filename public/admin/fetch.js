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

                    //implementing multiselect dropdown for category selection
                    const categorySelect=document.getElementById('categorySelect')
                    categorySelect.addEventListener('click',()=>{

                        const optionsContainer = document.getElementById('options-container');
                        if (optionsContainer.style.display === 'block') {
                            optionsContainer.style.display = 'none';
                        } else {
                            optionsContainer.style.display = 'block';
                        }

                    })


                    
                    const optionInputs = document.querySelectorAll('.option-input');
                    const selectedOptions = document.querySelector('.selected-options');
                    
                    optionInputs.forEach((input) => {
                        input.addEventListener('change', function () {
                            const selected = Array.from(optionInputs)
                                .filter((input) => input.checked)
                                .map((input) => input.value);
                            selectedOptions.textContent = selected.length > 0 ? selected.join(', ') : 'Select Categories';
                        });
                    });
                    
                    
                    //multiple imge upload
                    
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
                    

                    
                    //sending data to server on submit 
                    document.getElementById("addProduct").addEventListener('click',()=>{

                             // Create a FormData object to collect form data

                             const name=document.getElementById("name").value
                             const description=document.getElementById("description").value
                            
                             const brand=document.getElementById("brand").value
                             const stock=document.getElementById("stock").value
                             const price=document.getElementById("price").value
                            const color=document.getElementById("color").value
                            const careInstructions=document.getElementById("careInstructions").value
                            const material=document.getElementById("material").value
                            const additionalSpecifications=document.getElementById("additionalSpecifications").value
                            const size=document.getElementById('size').value

                            const images=document.getElementById('image-upload').files
                            
                            const formData = new FormData();
    
                            

                            const categoryCheckboxes = document.querySelectorAll('.option-input:checked');
                            const categoryIds=[]

                            categoryCheckboxes.forEach((categotyItem)=>{
                                categoryIds.push(categotyItem.value)

                            })
                            


                            formData.append('name', name);
                            formData.append('description', description);

                            for (let i = 0; i < categoryIds.length; i++) {
                                formData.append('category', categoryIds[i]);
                            }


                            
                            formData.append('brand', brand);
                            formData.append('stock', stock);
                            formData.append('price', price);
                            formData.append('size', size);
                            formData.append('color', color);
                            formData.append('careInstructions', careInstructions);
                            formData.append('material', material);
                            formData.append('additionalSpecifications', additionalSpecifications);
                        
                            for (let i = 0; i < images.length; i++) {
                                formData.append('images', images[i]);
                            }

                              
                                // Send a POST request to the server using the Fetch API
                                fetch('/admin/addProduct', {
                                    method: 'POST',
                                    body: formData,

                                })
                                .then(response => response.json())
                                .then(data => {
                                   
                                    
                                    if(data.success){
                                        //resetting form
                                     document.getElementById('addProductForm').reset();
                                     imagePreviewContainer.innerHTML = '';
                                     document.getElementById("categorylist").innerHTML='Select Categories';

                                    }

                                    // Handle the response from the server
                                    document.getElementById('alertMessage').textContent = data.message;
                                    clearAlert()

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
                



        }else if(e.target.id == 'viewProducts'){
            //loading products
            fetch('admin/viewProducts')
            .then(response=>{
                if(!response.ok){
                    throw new Error("Unable to get response from server")
                }
                return response.text()
            })
            .then(html=>{

                    pageContent.innerHTML=html

                    //adding event listner to each action in the displayed product detains using event deligation
                function viewProduct(){
                    document.getElementById("productTable").addEventListener('click',function(e){
                            
                        if(e.target.classList.contains('dropdown-item')){
                            
                            if(e.target.classList.contains('status')){

                            //script code to activate or in activate product 
                                
                                const productId=e.target.getAttribute('productId')

                                const modal=document.getElementById('myModal')
                                modal.style.display='block'
                                modal.setAttribute('product-id',productId)
                                
                                

                                document.getElementById('closeBtn').addEventListener('click',()=>{
                                    modal.style.display='none'
                                })

                                document.getElementById('confirmBtn').addEventListener('click',(e)=>{
                                    e.stopImmediatePropagation()
                                    
                                    const productId=document.getElementById('myModal').getAttribute('product-id')
                                    
                                    
                                    document.getElementById('myModal').style.display='none'
                                    
                                    
                                        fetch('/admin/changeProductStatus',{
                                            method:"PATCH",
                                            headers:{'Content-Type':'application/json'},
                                            body:JSON.stringify({productId:productId})
                                        })
                                        .then(response=>{
                                            if(response.ok){
                                                return response.json()
                                            }
                                            throw new Error("Connection to server failed")
                                        
                                        })
                                        .then(data=>{
                                            
                                            document.getElementById('alertMessage').textContent = data.message;
                                            clearAlert()
        
                                            const product=document.getElementById(productId)
                                            
        
                                            const statusChanger=product.querySelector('.status')
                                            const statusInfo=product.querySelector('.text-success,.text-danger')
        
                                            if(data.status==='activated'){
                                                
                                                statusChanger.textContent="inactivate"
                                                statusInfo.textContent='active'
                                                statusInfo.classList.remove('text-danger')
                                                statusInfo.classList.add('text-success')
                                            }else{
                                                
                                                statusChanger.textContent="activate"
        
                                                statusInfo.textContent="inactive"
                                                statusInfo.classList.remove('text-success')
                                                statusInfo.classList.add('text-danger')
        
                                            }
        
                                        })
                                        .catch((error)=>{
                                            console.log(error.message)
                                        })
                                    
                                })
                                
                               
                                
                            }else if(e.target.classList.contains('edit')){
                                const productId=e.target.getAttribute('productId')

                                fetch(`/admin/editProduct?id=${productId}`)
                                .then(response=>{
                                    if(response.ok){
                                        return response.text()
                                    }
                                    throw new Error("Unable to connect to server")
                                })
                                .then(html=>{
                                    pageContent.innerHTML=html

                                })
                                .catch((error)=>{
                                    console.log(error.message)
                                })

                            }



                        }else if(e.target.classList.contains('viewMore')){
                            const productId=e.target.getAttribute('productId')
                           
                            
                            fetch(`/admin/viewMoreProductInfo?productId=${productId}`)
                            .then(response=>{
                                if(response.ok){
                                    return response.text()
                                }
                                throw new Error("Unable to get more info")
                            })
                            .then(html=>{
                                
                                document.getElementById('viewModalClose').addEventListener('click',()=>{
                                    
                                    
                                    document.getElementById('viewModal').style.display='none'
                                })

                                document.getElementById('viewModal').style.display='block'
                                document.getElementById('viewModal-content').innerHTML=html

                            })

                        }

                    })
                }
                viewProduct()
                    //activation/inactivation end

                    function pagination(){
                    const prev=document.getElementById('prevProduct')
                    const currentBtn=document.getElementById("currentProduct")
                    const next=document.getElementById("nextProduct")

                    var totalpages=document.getElementById("totp").value
                   
                    var currentPage = document.getElementById("cur").value
                   

                    function updatepagination(){
        
        
                        prev.disabled= currentPage==1 ;
                        next.disabled= currentPage == totalpages;
                        currentBtn.textContent=currentPage;
                    }

                    updatepagination()

                            
                prev.addEventListener('click', function(e) {
                    
                    if (currentPage > 1) {
                        
                        
                        currentPage--;
                        updatepagination();
                        fetchDataForPage(currentPage);
                    }
                });
                
                next.addEventListener('click', function(e) {
                    
                    
                    if (currentPage < totalpages) {
                        currentPage++;
                        updatepagination();

                        fetchDataForPage(currentPage);
                    }
                });
                function fetchDataForPage(Page){
       
                    const url = `/admin/viewProducts?page=${Page}`;
                    
            
                    // Make a GET request to the server
                    fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(html => {
                        // Update the pageContent div with the loaded HTML
                        pageContent.innerHTML = html;

                        pagination()
                        viewProduct()
                        //
                        
                       


                        
            
                        // const scriptSrc='/static/admin/viewCategoryPagination.js'
                        // const scriptexist=document.querySelector(`script[src="${scriptSrc}"]`)
            
                        // if(scriptexist){
                        //     scriptexist.parentNode.removeChild(scriptexist);
                        // }
            
            
                        // const script2=document.createElement('script');
                        // script2.src=scriptSrc;
                        // document.body.appendChild(script2);
                
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                    });
                }
                }
                pagination()
            })


        }
    }

},true)












