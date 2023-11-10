function getAddBrand(){
    fetch('/admin/loadAddBrand')
    .then(response =>{
        if(response.ok) return response.text()
        throw new Error('Unable to connect to the server')
    })
    .then(html=>{
        pageContent.innerHTML=html
        imagePreview()
        postBrand()
    })
    .catch((er)=>{
        console.log(er.message)
        window.location.href='/admin/500'
    })
}
let logo;
function imagePreview(){
    let cropper
    const imageUploadInput = document.getElementById('logo-upload');
    const imagePreviewContainer = document.getElementById('image-preview');
    
    imageUploadInput.addEventListener('change', (event) => {
        imagePreviewContainer.innerHTML = ''; // Clear previous previews
        

            const selectedImage = event.target.files[0];

            if(selectedImage){
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('image-preview-div');
            const image = document.createElement('img');
            image.src = URL.createObjectURL(selectedImage);
            logo=selectedImage
            // image.classList.add('image-preview');

            const cropButton = document.createElement('a');
            cropButton.innerHTML = '<i class="mdi mdi-crop-free "></i>';
            cropButton.id='cropImg'
            cropButton.classList.add('image-view-button');


            cropButton.addEventListener('click',(e)=>{
                        
                
                
             
                    

                   
                    const imgSrc=image.src;

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
                   
                   

                    const modal=document.getElementById('brandImgCrop')
                    modal.style.display='block';
                    document.getElementById('brandImgCrop').classList.remove('hidden');
                    document.getElementById('brandImgCrop-content').innerHTML=''
                    document.getElementById('brandImgCrop-content').appendChild(cropperDiv)

                    document.getElementById('saveCrop').addEventListener('click',()=>{
                       
                        

                        // Capture the cropped image data
                        const croppedCanvas = cropper.getCroppedCanvas();
                        
                        // Convert the cropped canvas to a Blob
                        croppedCanvas.toBlob(function (blob) {
                            // Create a File object with a specified filename
                            const croppedFile = new File([blob], 'cropped_img'+Date.now()+'.png', { type: 'image/png' });
                            
            
                            image.src = URL.createObjectURL(croppedFile);
                           logo=croppedFile
                            



                        }, 'image/png');

                        document.getElementById('brandImgCrop').classList.add('hidden');


                    });

                    // cropperImage.src=imgSrc

                     cropper=new Cropper(cropperImage,{
                        aspectRatio:0,
                        viewMode:0
                    })

    })


            imageDiv.appendChild(image)
            imageDiv.appendChild(cropButton)
            imagePreviewContainer.appendChild(imageDiv);
            }

    });
        
}

function postBrand(){


    document.getElementById('addBrandForm').addEventListener('submit',(e)=>{
        e.preventDefault()

        const name=document.getElementById('brandName').value
        const description=document.getElementById('brandDescription').value



        const formData=new FormData()
        formData.append('name',name)
        formData.append('description',description)
        formData.append('logo',logo)
    
        fetch('/admin/addBrand',{
            method:'POST',
            body:formData
        })
        .then(response=>{
            if(!response.ok) throw new Error('brand data upload failed')
            return response.json()
        })
        .then(data=>{

            if(data.success){
                 document.getElementById('addBrandForm').reset();
                 document.getElementById("image-preview").innerHTML=''
            }

            
            const modal=document.getElementById('viewModal')
            modal.style.display='block'
            document.getElementById('viewModal-content').innerHTML=data.message


            document.getElementById('closeBtn').addEventListener('click',()=>{
                modal.style.display='none'
            })
        })
        .catch((er)=>{
            console.log(er)
            window.location.href='/admin/500'
    
        })

    })
  

}