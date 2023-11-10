function showImgPreview(imgId,imgPreviewId){
   
        const img=document.getElementById(imgId)
        const imgPreview=document.getElementById(imgPreviewId)


        const file=img.files[0]
        if(file){
            
        const reader=new FileReader()
        reader.onload=function(e){
            
            imgPreview.src=e.target.result
        }
        reader.readAsDataURL(file)
        }

}

//function to implement multi select dropdown
function multiSelectDropdown(){

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

}

//function to sent edited data to server
let selectedImagesArray=[]

function updateProduct(){
    const updateProduct=document.getElementById('editProduct')
    updateProduct.addEventListener('click',()=>{

        const id=document.getElementById('id').value
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
       formData.append('id',id);



    for (let i = 0; i < selectedImagesArray.length; i++) {
        formData.append('images', selectedImagesArray[i].image);
    } 



       if(validateProductData(formData,'editProductForm')){
            fetch('/admin/updateProduct',{
                method:"PUT",
                body:formData
            })
            .then(response=>{
                if(response.ok){
                    return response.json()
                }
                throw new Error("Unable to Update product")
            })
            .then(data=>{
                
                document.getElementById('alertMessage').innerHTML=data.message
                clearAlert()

                document.getElementById('editProductForm').scrollIntoView({
                    behavior: 'smooth', // You can use 'auto' for instant scrolling
                    block: 'start' // Scroll to the top of the form
                });
            })
            .catch((er)=>{
                console.log(er)
                
                // window.location.href='/admin/500'
            })
    }

    })

}

                function imageEditor(existingImageURLs){
                  
                     //multiple imge upload
                     const imageUploadInput = document.getElementById('image-upload');
                     const imagePreviewContainer = document.getElementById('image-preview');
                    
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
                             alert('You can select a maximum of 4 images.');
                             imageUploadInput.value = ''; // Clear the input field
                             return;
                         }
                     

                         setupEditableImages(selectedImages, existingImageURLs);
 
 
                         
                     });

                        // Handle existing images on page load
                    if (existingImageURLs && existingImageURLs.length > 0) {
                        setupEditableImages([], existingImageURLs);
                    }



                    function setupEditableImages(selectedImages, existingImageURLs){
                        console.log('---selectedImages-------',selectedImages)
                        console.log('----existingImageURLs---',existingImageURLs)

                        const imagesToDisplay = selectedImages.length > 0 ? selectedImages : existingImageURLs;
                        selectedImagesArray=[]
                        for (let i = 0; i < imagesToDisplay.length; i++) {
                           
                            // selectedImagesArray.push(imagesToDisplay[i]);

                            const image = document.createElement('div');
                            image.classList.add('image-preview-div');
                    
                            const imgElement = document.createElement('img');

                            if (typeof imagesToDisplay[i] === 'string') {
                                // It's an existing image URL
                                const imageUrl = imagesToDisplay[i];
                                convertUrlToFile(imageUrl, (file) => {
                                    const identifier=`${Date.now()}${i}`
                                    imgElement.src = URL.createObjectURL(file);
                                    imgElement.setAttribute('identifier',identifier)
                                    selectedImagesArray.push({image:file,identifier:identifier});
                                });
                            } else {
                                // It's a newly added image as a Blob or File
                                const identifier=`${Date.now()}${i}`
                                imgElement.src = URL.createObjectURL(imagesToDisplay[i]);
                                imgElement.setAttribute('identifier',identifier)
                                selectedImagesArray.push({image:imagesToDisplay[i],identifier:identifier});
                            }
                            
                            

                            console.log('selectedImagesArray--------------after file conversion',selectedImagesArray)
                    

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

                                console.log('at remove----',selectedImagesArray)

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
                                               console.log('at save crop ----------',selectedImagesArray)
    
            
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
                    }
                    

     
            }

            // Function to convert URL to File
function convertUrlToFile(url, callback) {
  
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const filename = url.substring(url.lastIndexOf('/') + 1);
            const file = new File([blob], filename, { type: blob.type });
            
            callback(file);
        })
        .catch(error => console.error('Error converting URL to File:', error));
}
                    
