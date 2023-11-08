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

        // const image1=document.getElementById('img1').files[0]
        // const image2=document.getElementById('img2').files[0]
        // const image3=document.getElementById('img3').files[0]
        // const image4=document.getElementById('img4').files[0]

        // const imgs=[image1,image2,image3,image4]


       
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

    //    imgs.forEach((v,i)=>{
    //     if(v){
    //         formData.append('image'+i,v)
    //     }else{
    //         formData.append('image'+i,null)
    //     }
    //    })



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
                console.log(er.message)
                
                window.location.href='/admin/500'
            })
    }

    })

}

        //         function imageEditor(){
                  
        //             //multiple imge upload
        //             const imageUploadInput = document.getElementById('image-upload');
        //             const imagePreviewContainer = document.getElementById('image-preview');
            
        //             let selectedImagesArray=[]
        //             let  imgCropper;

        //             imageUploadInput.addEventListener('click',(e)=>{
        //                 e.target.parentNode.querySelector('input').value=''
        //                 selectedImagesArray=[]
        //                 document.getElementById('image-preview').innerHTML=''
        //             })

        //             imageUploadInput.addEventListener('change', (event) => {
        //                 imagePreviewContainer.innerHTML = ''; // Clear previous previews


        //                 const selectedImages = event.target.files;
        //                 if (selectedImages.length > 4) {
        //                     alert('You can select a maximum of 4 images.');
        //                     imageUploadInput.value = ''; // Clear the input field
        //                     return;
        //                 }
                    
                        


        //                 for (let i = 0; i < selectedImages.length; i++) {
        //                     selectedImagesArray.push(selectedImages[i]);

        //                     const image = document.createElement('div');
        //                     image.classList.add('image-preview-div');
        //                     image.id='imgDiv'+i
                    
        //                     const imgElement = document.createElement('img');
        //                     imgElement.id='img'+i
        //                     imgElement.src = URL.createObjectURL(selectedImages[i])
        //                     imgElement.classList.add('image-preview');

        //                     // ----------------------------------crop image

        //                     const cropButton = document.createElement('button');
        //                     cropButton.innerHTML = '<i class="mdi mdi-crop-free cropProductImg"></i>';
        //                     cropButton.id=i
        //                     cropButton.classList.add('image-view-button');


                           


        //                     // -------------------------------crop part ends

        //                     const removeButton = document.createElement('button');
        //                     removeButton.innerHTML = '<i class="mdi mdi-close-circle"></i>';
        //                     removeButton.id='removeImg'+i
        //                     removeButton.classList.add('image-preview-remove-button');
                            
                    
                    
        //                     image.appendChild(imgElement);
        //                     image.appendChild(removeButton)
        //                     image.appendChild(cropButton);
        //                     imagePreviewContainer.appendChild(image);
        //                 }
        //             });



        //         document.getElementById('image-preview').addEventListener('click',(e)=>{
                       
        //            if(e.target.classList.contains('mdi-close-circle')){
        //                 const index=e.target.parentNode.id.slice(9)
                       
                       
        //                     document.getElementById('imgDiv'+index).remove();
                            
        //             // Remove the image and button when clicked
        //             const removedImageIndex = index
        //             if (selectedImagesArray.length) {
        //                 selectedImagesArray.splice(removedImageIndex, 1); // Remove the image from the array
        //             }
        //             }
        //     },true)


     
        // }
                    
