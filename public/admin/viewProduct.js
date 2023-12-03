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
                            throw { status: response.status, data: response.json() };
                        
                        })
                        .then(data=>{

                            showMessage(data.message)

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
                        .catch(handleError)
                    
                })
                
               
                
            }else if(e.target.classList.contains('edit')){
                const productId=e.target.getAttribute('productId')

                fetch(`/admin/editProduct?id=${productId}`)
                .then(response=>{
                    if(response.ok){
                        return response.text()
                    }
                    throw { status: response.status, data: response.json() };
                })
                .then(html=>{
                    pageContent.innerHTML=html;
                    const imageBasePath = '/static/productImages/';
                    const existingImages = document.getElementById('imagesArr').value.split(',').filter(Boolean);
                
                    // Convert image names to URLs
                    const existingImageURLs = existingImages.map(imageName => `${imageBasePath}${imageName}`);
                
                    imageEditor(existingImageURLs); //this function is located at => public\admin\editProductFunction.js
                    
                    multiSelectDropdown()
                   
                    updateProduct() //this function is located at => public\admin\editProductFunction.js

                })
                .catch(handleError)

            }



        }else if(e.target.classList.contains('viewMore')){
            const productId=e.target.getAttribute('productId')
           
            
            fetch(`/admin/viewMoreProductInfo?productId=${productId}`)
            .then(response=>{
                if(response.ok){
                    return response.text()
                }
                throw { status: response.status, data: response.json() };
            })
            .then(html=>{
                
                document.getElementById('viewModalClose').addEventListener('click',()=>{
                    
                    
                    document.getElementById('viewModal').style.display='none'
                })

                document.getElementById('viewModal').style.display='block'
                document.getElementById('viewModal-content').innerHTML=html

            })
            .catch(handleError)

        }

    })
}


function productPagination(){
    
    
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
            throw { status: response.status, data: response.json() };
        }
        return response.text();
    })
    .then(html => {
        // Update the pageContent div with the loaded HTML
        pageContent.innerHTML = html;

        productPagination()
        viewProduct()
        searchProduct()
        //
        
       


    })
    .catch(handleError);
}
}




function searchProduct(){
    const productSearchForm=document.getElementById('productSearchForm')
   
    // const searchProduct=document.getElementById('searchProduct')

    productSearchForm.addEventListener('submit',function(e){
        e.preventDefault()
         const key=document.getElementById('searchKey').value
        const field=document.getElementById('SearchField').value
        
        
        fetch(`/admin/searchProduct?field=${field}&key=${key}`)
        .then(response=>{
            if(!response.ok){
                throw { status: response.status, data: response.json() };
            }
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
              return response.json(); // Parse JSON response
            } else {
              return response.text(); // Assume HTML content
            }
            
        })
        .then(data=>{
            if (typeof data === 'object') {

                showMessage(data.message)
              } else {
                // Handle HTML response
                document.getElementById('pageContent').innerHTML = data;
                searchProduct()
                viewProduct()
                
              }
            
        })
        .catch(handleError)

    })
}




function removeProductOffer(productId){

    fetch('/admin/removeOffer',{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({productId:productId})
    })
    .then(response=>{
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };
    })
    .then(data=>{
        if(data.removed){
    
                Swal.fire({
                icon: "success",
                text: data.message,
                showConfirmButton: false,
                timer: 1500
                });
                option=document.getElementById(`manageOffer${productId}`)
                option.classList.remove('removeOffer')
                option.classList.add('applyOffer')
                option.innerHTML='apply offer'

                document.getElementById('offer'+productId).innerHTML=''
        }else{
            Swal.fire({
                icon: "error",
                text: data.message,
                showConfirmButton: false,
                timer: 1500
                });
        }
    })
    .catch(handleError)
}