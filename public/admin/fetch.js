var pageContent = document.getElementById('pageContent');


document.getElementById('sideNavBar').addEventListener("click",(e)=>{
    
   
    if(e.target.classList.contains('adminOption')){
        
        
        if(e.target.id=='view-categoryAnchor'){

            // view category

                const pageUrl = '/admin/viewCategory';

                fetch(pageUrl)
                .then(response => {
                    if (!response.ok) {
                        throw { status: response.status, data: response.json() };
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
                .catch(handleError);

        //if closed  
    
        }else if(e.target.id =='add-categoryAnchor'){

        
            // add category

                
                // Specify the URL of the page you want to load
                const pageUrl = '/admin/addCategory';

                fetch(pageUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw { status: response.status, data: response.json() };
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
                    .catch(handleError);
            


        }else if(e.target.id =='view-userAnchor'|| e.target.id =='view-span'){

                    
            //view users

            function viewUsers(){
                
                    // Specify the URL of the page you want to load
                    const pageUrl = '/admin/loadUsers';
                
                    fetch(pageUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw { status: response.status, data: response.json() };
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
                        .catch(handleError);
                
                }
                viewUsers()

        }else if(e.target.id =='add-productAnchor'){

        //load add product 
            const pageUrl = '/admin/addProduct';

            fetch(pageUrl)
                .then(response => {
                    if (!response.ok) {
                        throw { status: response.status, data: response.json() };
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
                    let selectedImagesArray=[]
                    let  cropper;

                    imageUploadInput.addEventListener('click',(e)=>{
                        e.target.parentNode.querySelector('input').value=''
                        selectedImagesArray=[]
                        document.getElementById('image-preview').innerHTML=''
                    })

                    imageUploadInput.addEventListener('change', (event) => {
                        imagePreviewContainer.innerHTML = ''; // Clear previous previews


                        const selectedImages = event.target.files;
                        if (selectedImages.length > 4) {
                            showMessage('You can select a maximum of 4 images.');
                            imageUploadInput.value = ''; // Clear the input field
                            return;
                        }
                    
                        


                        for (let i = 0; i < selectedImages.length; i++) {
                            const identifier=`${Date.now()}${i}`
                            selectedImagesArray.push({image:selectedImages[i],identifier:identifier});

                            const image = document.createElement('div');
                            image.classList.add('image-preview-div');
                    
                            const imgElement = document.createElement('img');
                            imgElement.src = URL.createObjectURL(selectedImages[i])
                            imgElement.setAttribute('identifier',identifier)
                            // imgElement.classList.add('image-preview');

                            // ----------------------------------crop image

                            const cropButton = document.createElement('a');
                            cropButton.innerHTML = '<i class="mdi mdi-crop-free "></i>';
                            cropButton.id=i
                            cropButton.classList.add('image-view-button');


                           


                            // -------------------------------crop part ends

                            const removeButton = document.createElement('a');
                            removeButton.innerHTML = '<i class="mdi mdi-close-circle"></i>';
                            removeButton.classList.add('image-preview-remove-button');
                            // removeButton.setAttribute('index',i)
                            
                    
                            removeButton.addEventListener('click', () => {
                                image.remove(); // Remove the image and button when clicked
                                const key=imgElement.getAttribute('identifier')
                                
                                const removedImageIndex = selectedImagesArray.findIndex(imageData=>imageData.identifier==key);
                                
                                if (removedImageIndex !== -1) {
                                    selectedImagesArray.splice(removedImageIndex, 1); // Remove the image from the array
                                }


                            });


                            cropButton.addEventListener('click',(e)=>{
                        
                                    const key=imgElement.getAttribute('identifier')
                                    
                                    const index = selectedImagesArray.findIndex(imageData=>imageData.identifier==key);
                                        

                                       
                                        const imgSrc=imgElement.src;
        
                                        //creating new imagepreview for image croping
                                        const cropperDiv=document.createElement('div')
                                        cropperDiv.classList.add('cropperDiv')
    
                                        
                                        const cropperImage=document.createElement('img')
                                        cropperImage.src=imgSrc;
    
                                        const saveCrop=document.createElement('a')
                                        saveCrop.classList.add('saveCrop')
                                        saveCrop.textContent='SAVE'
                                        saveCrop.id='saveCrop'
    
        
                                        cropperDiv.appendChild(cropperImage)
                                        cropperDiv.appendChild(saveCrop)
                                       
                                       
    
                                        const modal=document.getElementById('viewModal')
                                        modal.style.display='block';
                                        document.getElementById('viewModal').classList.remove('hidden');
                                        document.getElementById('viewModal-content').innerHTML=''
                                        document.getElementById('viewModal-content').appendChild(cropperDiv)
    
                                        document.getElementById('saveCrop').addEventListener('click',()=>{
                                           
                                            
    
                                            // Capture the cropped image data
                                            const croppedCanvas = cropper.getCroppedCanvas();
                                            
                                            // Convert the cropped canvas to a Blob
                                            croppedCanvas.toBlob(function (blob) {
                                                // Create a File object with a specified filename
                                                const croppedFile = new File([blob], 'cropped_img'+Date.now()+'.png', { type: 'image/png' });
                                                
                                
                                                imgElement.src = URL.createObjectURL(croppedFile);
                                               
                                                selectedImagesArray[index].image=croppedFile
    
    
            
                                            }, 'image/png');
    
                                            document.getElementById('viewModal').classList.add('hidden');
            
            
                                        });
    
                                        // cropperImage.src=imgSrc
    
                                         cropper=new Cropper(cropperImage,{
                                            aspectRatio:0,
                                            viewMode:0
                                        })
          
                        },true)

                    
                            image.appendChild(imgElement);
                            image.appendChild(removeButton)
                            image.appendChild(cropButton);
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

                            
                            const formData = new FormData();
    
                            

                            const categoryCheckboxes = document.querySelectorAll('.option-input:checked');
                            const categoryIds=[]

                            categoryCheckboxes.forEach((categotyItem)=>{
                                categoryIds.push(categotyItem.getAttribute('catgoryId'))

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
                        
                            for (let i = 0; i < selectedImagesArray.length; i++) {
                                formData.append('images', selectedImagesArray[i].image);
                            } 


                            if(validateProductData(formData,'addProductForm')){
                              
                                // Send a POST request to the server using the Fetch API
                                fetch('/admin/addProduct', {
                                    method: 'POST',
                                    body: formData,

                                })
                                .then(response => {
                                    if(response.ok) return response.json()
                                    throw { status: response.status, data: response.json() };
                                })
                                .then(data => {
                                   
                                    
                                    if(data.success){
                                        //resetting form
                                     document.getElementById('addProductForm').reset();
                                     imagePreviewContainer.innerHTML = '';
                                     document.getElementById("categorylist").innerHTML='Select Categories';

                                    }

                                    showMessage(data.message)

                                    document.getElementById('addProductForm').scrollIntoView({
                                        behavior: 'smooth', // You can use 'auto' for instant scrolling
                                        block: 'start' // Scroll to the top of the form
                                    });
                                })
                                .catch(handleError);
                            }

                        
                    })
                
                    
                    

                })
                .catch(handleError);
                



        }else if(e.target.id == 'viewProducts'){
            
            //loading products
            fetch('/admin/viewProducts')
            .then(response=>{
                if(!response.ok){
                    throw { status: response.status, data: response.json() };
                }
                return response.text()
            })
            .then(html=>{

                    pageContent.innerHTML=html

                    //calling searchProduct support function
                    searchProduct()

                    
               
                viewProduct()//this function is present in view product.js
                   

                   
                    productPagination()
            })
            .catch(handleError)


        }else if(e.target.id=='add-brand'){
            getAddBrand()
        
        }else if(e.target.id=='view-brands'){
            viewBrands()
            
        }else if(e.target.id=='listOrders'){
            listOrders()
        }else if(e.target.classList.contains('salesReport')){
            loadSalesReport()
        }else if(e.target.id=='addCoupone'){
            loadPage(`/admin/getAddCoupone`,[])
        }else if(e.target.id=='viewCoupones'){
            loadPage('/admin/viewCoupones',[])
        }else if(e.target.id=='addOffer'){
            loadPage('/admin/getAddOffer',[])
        }else if(e.target.id=='viewOffers'){
            loadPage('/admin/viewOffers',[updateOfferPagination])
        }
    }

},true)







//action performed in the right block

document.getElementById('pageContent').addEventListener('click',(e)=>{

    if(e.target.id=='viewModalClose'){
        
        document.getElementById('viewModal').style.display='none'

    }else if(e.target.id=='brandImgCropClose'){
        document.getElementById('brandImgCrop').style.display='none'
    }
    
    if(e.target.classList.contains('productAction')){
       
        if(e.target.classList.contains('applyOffer')){
          
            getOffers(e.target.getAttribute('productId'),'productId')
        }else if(e.target.classList.contains('removeOffer')){
            Swal.fire({
                title: "Are you sure?",
                text: "Are you sure you want to remove this offer from this product? This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, remove it!"
              }).then((result) => {
                if (result.isConfirmed) {
                    removeProductOffer(e.target.getAttribute('productId'))
                }
              });
            
        }
    
    }else if(e.target.classList.contains('categoryAction')){
        if(e.target.classList.contains('applyOffer')){
            getOffers(e.target.getAttribute('categoryId'),'categoryId')
        }else if(e.target.classList.contains('removeOffer')){

            
            Swal.fire({
                title: "Are you sure?",
                text: "Are you sure you want to remove this offer from this category? This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, remove it!"
              }).then((result) => {
                if (result.isConfirmed) {
                    removeCategoryOffer(e.target.getAttribute('categoryId'))
                }
              });
            
        }

    }else if(e.target.classList.contains('orderOption')){
        if(e.target.id=='nextOrders'){
           
            nextOrders()
        }else if(e.target.id=='prevOrders'){
         
            prevOrders()
        }else if(e.target.classList.contains('manageOrder')){
            viewOrder(e.target.getAttribute('orderId'))
        }else if(e.target.classList.contains('updateOrderStatus')){

            Swal.fire({
                
                text: "Are you sure? You want to change the status of this order",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Change status",
                coustomClass:{
                    title:'set-color'
                }
              }).then((result) => {
                if (result.isConfirmed) {
                    updateOrderStatusByAdmin(e.target)
                }
              });
            
        }else if(e.target.classList.contains('updateReturnStatus')){
            Swal.fire({
                
                text: "Are you sure? You want to update return  status of this order",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Change status",
                coustomClass:{
                    title:'set-color'
                }
              }).then((result) => {
                if (result.isConfirmed) {
                    updateReturnStatus(e.target)
                }
              });
        }
        
    }else if(e.target.classList.contains('reportAction')){
        if(e.target.id=='yearlySales'){
            setActive(e.target)
            getSalesReport('year')
        }else if(e.target.id=='monthlySales'){
            setActive(e.target)
            getSalesReport('month')
        }else if(e.target.id=='weeklySales'){
            setActive(e.target)
            getSalesReport('week')
        }else if(e.target.classList.contains('timePeriod')){
            setChoose(e.target)
            changeSalesDataTimePeriod(e.target.getAttribute('time'))
        }else if(e.target.id=='salesPaymentStatus'){
            filterBySalesPaymentStatus(e.target.value)
        }else if(e.target.id=='salesOrderStatus'){
            filterBySalesOrderStatus(e.target.value)
        }else if(e.target.id=='downloadExcel'){
            downloadTableInExcel()
        }else if(e.target.id=='downloadPdf'){
            downloadTableInPdf()
        }
    }else if(e.target.classList.contains('couponeAction')){
            if(e.target.id=='addCoupone'){
               
                addCoupone()
            }else if(e.target.classList.contains('edit')){
                loadPage(`/admin/editCoupone?id=${e.target.getAttribute('couponeId')}`,[])
            }else if(e.target.id=='updateCoupone'){
                updateCoupone()
            }else if(e.target.classList.contains('status')){
                listUnlistCoupone(e.target.getAttribute('couponeId'))
            }

    }else if(e.target.classList.contains('offerAction')){
        if(e.target.id=='addOffer'){
            addOffer()
        }else if(e.target.classList.contains('edit')){
            loadPage(`/admin/editOffer?id=${e.target.getAttribute('offerId')}`,[])
        }else if(e.target.id=='updateOffer'){
            updateOffer()
        }else if(e.target.classList.contains('status')){
            listUnlistOffer(e.target.getAttribute('offerId'))

        }else if(e.target.id=='nextOffers'){
         
            nextOffers()
        }else if(e.target.id=='prevOffers'){
            prevOffers()
        }else if(e.target.classList.contains('applayOfferLink')){
            const modal=document.getElementById('viewModal')
            const productId=modal.getAttribute('productId')
            const categoryId=modal.getAttribute('categoryId')

            Swal.fire({
                title: "Are you sure?",
                text: "Confirm offer application to this product?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, applay it!"
              }).then((result) => {
                if (result.isConfirmed) {
                    if(productId) applayOfferToProduct(e.target.getAttribute('offer'),productId)
                    if(categoryId) applayOfferToCategory(e.target.getAttribute('offer'),categoryId)
                }
              });
            
        }
        
    }


    

},true)






function loadPage(url,callBacks){
    fetch(url)
    .then(response=>{
        if(response.ok) return response.text()
        throw { status: response.status, data: response.json() };
    })
    .then(html=>{
        pageContent.innerHTML=html
        for(let cb of callBacks){
            cb()
        }
    })
    .catch(handleError)
}

function resetErrormsg(){
    pageContent.addEventListener('click',(e)=>{
           if(e.target.classList.contains('form-control')){
            const targetDiv=e.target.nextElementSibling
            if(targetDiv && targetDiv.classList.contains('error')) targetDiv.innerHTML=''        
           }
    },true)
}
resetErrormsg()


function showMessage(message){
    Swal.fire({
        position:'bottom',
        html: `
            <div class="p-3 ">
                    ${message}
            </div>
        `,
        showConfirmButton: false,
        timer: 2500,
        
      });
  }


  function handleError(error) {
     
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error: Unable to reach the server.');
      // Optionally show a user-friendly message to the user
    } else {
      error.data.then(data => {
        console.error('Fetch error:', error);
        const queryParams = new URLSearchParams({
          statusCode: data.statusCode,
          message: data.message,
          status: data.status,
          homeLink: data.homeLink,
        });
        console.log(queryParams.toString())
        window.location.href = `/error?${queryParams.toString()}`;
      });
    }
  }