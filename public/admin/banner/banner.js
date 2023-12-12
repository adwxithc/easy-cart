let cropper,bannerImg;

document.addEventListener('DOMContentLoaded',()=>{
    //CHECKING WHETER THE CODE IS IN EDIT BANNER PAGE
    const flag=document.getElementById('editBannerFlag')
    if(flag){

        convertUrlToFile(flag.value, (file) => {
           
            bannerImg=file;

        });
    }
})

//PREVIEW UPLOADED IMAGE
function previewBannerImg(){
    const bannerUploadInput = document.getElementById('banner-upload');
    if(!bannerUploadInput) return;

 
    //SETTING EVENT ON IMAGE UPLOAD CHANGE
    bannerUploadInput.addEventListener('change',(e)=>{

        //GETTING THE UPLOADED IMAGE
        const selectedImage=e.target.files[0];
        bannerImg=selectedImage;
        //IF IMAGE UPLOADED SHOW IT
        if(selectedImage){
            const image = document.getElementById('banner-img')
            image.src = URL.createObjectURL(selectedImage);
           
        }
    })
}
previewBannerImg()

//SHOW A CROPING MODAL
function cropBannerImg(){

    if(!document.getElementById('crop-banner-img')) return;

    document.getElementById('crop-banner-img').addEventListener('click',()=>{
        
        const image = document.getElementById('banner-img')

        const modal=document.getElementById('bannerCrop');
      
        modal.style.display='block';

        const cropImg=document.getElementById('bannerCropImg')
        cropImg.src=image.src

        cropper=new Cropper(cropImg,{
            aspectRatio:0,
            viewMode:0
        })
    })

}
cropBannerImg()

//CLOSE CROP MODAL
function closeBannerImgCrop(){
    if(!document.getElementById('bannerImgCropClose')) return;

    document.getElementById('bannerImgCropClose').addEventListener('click',()=>{
        document.getElementById('bannerCrop').style.display='none'
        cropper.destroy()
    })
}
closeBannerImgCrop()

//SAVE CROPED IMAGE
function saveCroppedBannerImg(){

    if(!document.getElementById('saveCropedImg')) return;
    saveCropedImg.addEventListener('click',()=>{

         // Capture the cropped image data
         const croppedCanvas = cropper.getCroppedCanvas();
                        
         // Convert the cropped canvas to a Blob
         croppedCanvas.toBlob(function (blob) {
             // Create a File object with a specified filename
             const croppedFile = new File([blob], 'cropped_img'+Date.now()+'.png', { type: 'image/png' });
             
             const image = document.getElementById('banner-img')
             image.src = URL.createObjectURL(croppedFile);
             bannerImg=croppedFile

         }, 'image/png');

         document.getElementById('bannerCrop').style.display='none';
        cropper.destroy()

    })
}
saveCroppedBannerImg()

//VALIDATE BANNER DATA
function validateBannerData(formData,img){

    const miniTitle=formData.get('miniTitle').trim()
    const mainTitle=formData.get('mainTitle').trim()
    const description=formData.get('description').trim()
    const link=formData.get('link').trim()

    const miniTitleError=document.getElementById('miniTitleError')
    const mainTitleError=document.getElementById('mainTitleError')
    const descriptionError=document.getElementById('descriptionError')
    const imgError=document.getElementById('imgError')
    const linkError=document.getElementById('linkError')
    if(!miniTitle || !mainTitle || !description || !link || !img){

        if(!miniTitle) miniTitleError.innerHTML="mini title can't be null"
        if(!mainTitle) mainTitleError.innerHTML="main title can't be null"
        if(!description) descriptionError.innerHTML="description  can't be null"
        if(!link) linkError.innerHTML="link  can't be null"
        if(!img) imgError.innerHTML="image  can't be null"

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        return false
    }

    return true
}

//PREVIEW ENTIRE BANNER
function preViewBanner(){
    const preview=document.getElementById('preViewBanner')
    if(!preview) return;
    preview.addEventListener('click',()=>{

        const formData=new FormData(document.getElementById('bannerForm'))
        if(validateBannerData(formData,bannerImg)){
            showPreview(formData,bannerImg)
        }
    })

}
preViewBanner()

//ADD NEW BANNER
 function saveBanner(){
    const saveBanner=document.getElementById('saveBanner')
    if(!saveBanner) return

    saveBanner.addEventListener('click',()=>{
        const formData=new FormData(document.getElementById('bannerForm'))

        if(validateBannerData(formData,bannerImg)){

            formData.set('bannerBackground',bannerImg)

            
            const url='/admin/addBanner'
           
           sendBannerData(formData,url,'POST',resetBannerForm)


        }
    })
}
saveBanner()

//UPDATE EXISTING BANNER
function updateBanner(){
    const updateBanner=document.getElementById('updateBanner')
    if(!updateBanner) return

    const bannerId=document.getElementById('editBannerFlag').getAttribute('bannerId')
    updateBanner.addEventListener('click',()=>{
        const formData=new FormData(document.getElementById('bannerForm'))

        if(validateBannerData(formData,bannerImg)){

            formData.set('bannerBackground',bannerImg)

          
            const url=`/admin/updateBanner?bannerId=${bannerId}`

            const success=sendBannerData(formData,url,'PUT',null)
        }
    })
}
updateBanner()

//SHOW BANNER PREVIEW
function showPreview(formData,bannerImg){
    const bannerPreview=document.getElementById('bannerPreview')

    const backGroundImg=document.getElementById('bannerBackGroundImg')
    const miniTitle=document.getElementById('bannerMiniTitle')
    const mainTitle=document.getElementById('bannerMainTitle')
    const description=document.getElementById('bannerDescription')
    const link=document.getElementById('bannerLink')
    

    if (typeof bannerImg === 'string') {
        // It's an existing image URL
       
        convertUrlToFile(bannerImg, (file) => {
           
            backGroundImg.style.backgroundImage=`url(${ URL.createObjectURL(file)})`;

        });
    }else{
        backGroundImg.style.backgroundImage=`url(${URL.createObjectURL(bannerImg)})`;

    }

    miniTitle.innerHTML=formData.get('miniTitle').trim()
    mainTitle.innerHTML=formData.get('mainTitle').trim()
    description.innerHTML=formData.get('description').trim()
    link.href=formData.get('link').trim()


    bannerPreview.style.display='block'
    window.scrollTo(0, document.body.scrollHeight);

}

//RESET THE FORM
function resetBannerForm(){
        document.getElementById('bannerForm').reset()
        document.getElementById('banner-img').src='/static/assets/img/banner/black11.jpg'
}


//FUNCTION TO SENT BANNER DATA TO SERVER
function sendBannerData(formData,url,method,cb){
        fetch(url,{
            method:method,
            body:formData
        })
        .then(response=>{
            if(response.status==401){
                window.location.href='/admin'
                return
              }
            if(response.ok) return response.json()
            throw { status: response.status, data: response.json() };
        })
        .then(data=>{
            if(data.success){

                showMessage(data.message)

               if(cb) cb()

            }else{
                showMessage(data.message)
                return false
            }
        })
        .catch(handleError)

}

//SETTING AN EVENT DELIGATION
if(document.getElementById('banners')){
//SETTING EVENT DELIGATION FOR BANNER OPERATIONS
document.getElementById('banners').addEventListener('click',(e)=>{

    //LIST OR UNLIST BANNER
    if(e.target.hasAttribute('status')){
        Swal.fire({
            title: "Are you sure?",
            text: "You want to change status of this banner,you won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "rgb(225, 9, 9)",
            cancelButtonColor: "#000",
            confirmButtonText: "Yes do it",
            customClass: {
                title: 'text-dark' // Add a custom class to the title element
            }
          }).then((result) => {
            if (result.isConfirmed){
                updateBannerStatus(e.target.getAttribute('bannerId'))
            }
          });
    }else if(e.target.hasAttribute('delete')){
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this banner,you won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "rgb(225, 9, 9)",
            cancelButtonColor: "#000",
            confirmButtonText: "Yes delete it",
            customClass: {
                title: 'text-dark' // Add a custom class to the title element
            }
          }).then((result) => {
            if (result.isConfirmed){
                deleteBanner(e.target.getAttribute('bannerId'))
            }
          });
    }
},true)
}

//LIST OR UNLIST BANNER
function updateBannerStatus(bannerId){
    fetch(`/admin/updateBannerStatus?bannerId=${bannerId}`,{
        method:'PUT',
    })
    .then(response=>{
        if(response.status==401){
            window.location.href='/admin'
            return
          }
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };
    })
    .then(data=>{
        if(data.success){
            //CHANGING THE STATUS IN  PAGE
           let elem=document.getElementById(`statusChanger${bannerId}`)
           let statusIndicator=document.getElementById(`status${bannerId}`)

            if(data.status){
                elem.classList='btn btn-warning '
                elem.innerHTML='unlist'
                statusIndicator.classList='mdi mdi-eye'

            }else{
                elem.classList='btn btn-success'
                elem.innerHTML='list'
                statusIndicator.classList='mdi mdi-eye-off '

            }
        }
        //SHOW RESPONSE MESSAGE FROM SERVER
        showMessage(data.message)

    })
    .catch(handleError)
}

//SOFT DELETE BANNER
function deleteBanner(bannerId){
    fetch('/admin/deleteBanner',{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({bannerId:bannerId})
    })
    .then(response=>{
        if(response.status==401){
            window.location.href='/admin'
            return
          }
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };
    })
    .then(data=>{
        if(data.success){
            document.getElementById(bannerId).remove()
        }
        showMessage(data.message)

    })
    .catch(handleError)
}

