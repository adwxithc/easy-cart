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

function imagePreview(){
    
    const imageUploadInput = document.getElementById('logo-upload');
    const imagePreviewContainer = document.getElementById('image-preview');
    
    imageUploadInput.addEventListener('change', (event) => {
        imagePreviewContainer.innerHTML = ''; // Clear previous previews
        

            const selectedImage = event.target.files[0];

            if(selectedImage){
            const image = document.createElement('img');
            image.src = URL.createObjectURL(selectedImage);
            image.classList.add('image-preview');
            imagePreviewContainer.appendChild(image);
            }
    });
        
}

function postBrand(){


    document.getElementById('addBrandForm').addEventListener('submit',(e)=>{
        e.preventDefault()

        const name=document.getElementById('brandName').value
        const description=document.getElementById('brandDescription').value
        const logo=document.getElementById('logo-upload').files[0]

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