let categoryImg
//PREVIEW UPLOADED IMAGE
function previewCategoryImg(){
    const imageInput = document.getElementById('img-upload');
    if(!imageInput) return;


    //SETTING EVENT ON IMAGE UPLOAD CHANGE
    imageInput.addEventListener('change',(e)=>{

        //GETTING THE UPLOADED IMAGE
        const selectedImage=e.target.files[0];
        categoryImg=selectedImage;
        //IF IMAGE UPLOADED SHOW IT
        if(selectedImage){
            document.getElementById('category-image-preview').style.display='block'
            const image = document.getElementById('category-img')
            image.src = URL.createObjectURL(selectedImage);
        
        }
    })
}
previewCategoryImg()


//SHOW A CROPING MODAL
function cropCategoryImg(){
const crop=document.getElementById('crop-category-img')

if(!crop) return;

crop.addEventListener('click',()=>{

const image = document.getElementById('category-img')

const modal=document.getElementById('ImgCrop');

modal.style.display='block';

const cropImg=document.getElementById('categoryCropImg')
cropImg.src=image.src

cropper=new Cropper(cropImg,{
    aspectRatio:0,
    viewMode:0
})
})

}
cropCategoryImg()

//CLOSE CROP MODAL
function closeImgCrop(){
if(!document.getElementById('imgCropClose')) return;

document.getElementById('imgCropClose').addEventListener('click',()=>{
    document.getElementById('ImgCrop').style.display='none'
    cropper.destroy()
})
}
closeImgCrop()

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
 
 const image = document.getElementById('category-img')
 image.src = URL.createObjectURL(croppedFile);
 categoryImg=croppedFile

}, 'image/png');

document.getElementById('ImgCrop').style.display='none';
cropper.destroy()

})
}
saveCroppedBannerImg()

function createCategory(){
const addCategory=document.getElementById('addCategory')
if(!addCategory) return

addCategory.addEventListener('submit',(e)=>{
    e.preventDefault()
    const formData=new FormData(addCategory)
    formData.set('categoryImg',categoryImg)

    if(!validateCategoryForm(formData)) return


    fetch('/admin/addCategory',{
        method:'POST',
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
        if(data.success) document.getElementById('addCategory').reset();

         // Handle the response from the server

        showMessage(data.message)
    })
    .catch(handleError)

})
}
createCategory()

function validateCategoryForm(formData){
const name=formData.get('name').trim()
const description=formData.get('description').trim()
const categoryImg=formData.get('categoryImg')

let isValid=true
if(!name || !description || !categoryImg){
if(!name){
    document.getElementById('nameError').innerHTML='*category name is required'
}
if(!description){
    document.getElementById('descriptionError').innerHTML='*category description is required'
}        
if(!categoryImg){
    document.getElementById('imgError').innerHTML='*category image is required'
    
}
isValid=false
}
return isValid
} 