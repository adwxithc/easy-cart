function viewBrands(){
    fetch('/admin/loadviewBrands')
    .then(response=>{
        if(response.ok) return response.text()
        throw new Error('unable to connect')
    })
    .then(html=>{
        pageContent.innerHTML=html
        brandPagination()

    })
    .catch((er)=>{
        window.location.href='/admin/500'
        console.log(er.message)

    })
}

function brandPagination(){
  
    // pagination
    brandOperations()

    const prev=document.getElementById('prevBrand')
    const currentBtn=document.getElementById("currentBrand")
    const next=document.getElementById("nextBrand")
   
    
    let totalpages=document.getElementById("totp").value
    let currentPage = document.getElementById("cur").value
    
    
    
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
           
           
            const url = `/admin/loadviewBrands?page=${Page}`;
    
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
                brandPagination()

        
            })
            .catch(error => {
                
                window.location.href='/admin/500'
                console.error('Fetch error:', error);
            });
        }
      
}

function brandOperations(){
    
    document.getElementById('brandTable').addEventListener('click',(e)=>{
        
            if(e.target.classList.contains('dropdown-item')){
                
                if(e.target.classList.contains('status')){
                    const id=e.target.getAttribute('brandId')
                    

                const modal=document.getElementById('myModal')
                modal.style.display='block'
                modal.setAttribute('brand-id',id)
                
                

                document.getElementById('closeBtn').addEventListener('click',()=>{
                    modal.style.display='none'
                })

                document.getElementById('confirmBtn').addEventListener('click',()=>{
                    e.stopImmediatePropagation()
                    const brandId=document.getElementById('myModal').getAttribute('brand-id')
                    document.getElementById('myModal').style.display='none'

                    fetch(`/admin/listUnlistBrand`,{
                        method:"PATCH",
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify({id:brandId})
                    })
                    .then(response=>{
                        if(response.ok) return response.json()
                    })
                    .then(data=>{
                        const modal=document.getElementById('viewModal')
                        modal.style.display='block'
                        document.getElementById('viewModal-content').innerHTML=data.message

                        document.getElementById('closeBrandAlert').addEventListener('click',()=>{

                            const brand=document.getElementById(brandId)
                            

                            const statusChanger=brand.querySelector('.status')
                            const statusInfo=brand.querySelector('.text-success,.text-danger')

                            if(data.brandStatus){
                                
                                statusChanger.textContent="unlist"
                                statusInfo.textContent='listed'
                                statusInfo.classList.remove('text-danger')
                                statusInfo.classList.add('text-success')
                            }else{
                                
                                statusChanger.textContent="list"

                                statusInfo.textContent="unlisted"
                                statusInfo.classList.remove('text-success')
                                statusInfo.classList.add('text-danger')

                            }
                        modal.style.display='none'
                        })
                    })

                })


                }else if(e.target.classList.contains('edit')){
                    const id=e.target.getAttribute('brandId')
                    fetch(`/admin/editBrand?id=${id}`)
                    .then(response=>{
                        if(response.ok) return response.text()
                        throw new Error("Unab]le to connect to server")
                    })
                    .then(html=>{
                        pageContent.innerHTML = html;
                        updateBrand()
                    })
                    .catch(error => {
                
                        window.location.href='/admin/500'
                        console.error('Fetch error:', error);
                    });
                }

            }
    },true)
}

function updateBrand(){
    document.getElementById('editBrandForm').addEventListener('submit',(e)=>{
        e.preventDefault()

        const name=document.getElementById('brandName').value
        const description=document.getElementById('brandDescription').value
        const logo= document.getElementById('logo-upload')?.files[0]
        const id=document.getElementById('id').value

        console.log(logo)
        
        
        const formData=new FormData()

        formData.append('name',name);
        formData.append('description',description);
        formData.append('logo',logo);
        formData.append('id',id);

        fetch('/admin/updateBrand',{
            method:"PUT",
            body:formData
        })
        .then(response=>{
            if(response.ok) return response.json()
            throw new Error('unable to connect to error')
        })
        .then(data=>{

            const modal=document.getElementById('viewModal')
            modal.style.display='block'
            document.getElementById('viewModal-content').innerHTML=data.message

            document.getElementById('closeBrandAlert').addEventListener('click',()=>{
                modal.style.display='none'
           
            });

        })
    })
}

function showlogoPreview(imgId,imgPreviewId){
   
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