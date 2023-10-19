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
                            window.location.href='/admin/500'
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
                    multiSelectDropdown()
                    updateProduct() //this function is located at => public\admin\editProductFunction.js

                })
                .catch((error)=>{
                    console.log(error.message)
                    window.location.href='/admin/500'
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
            .catch((er)=>{
                console.log(er.message)
                window.location.href='/admin/500'
            })

        }

    })
}


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
        searchProduct()
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
                throw new Error("can't get searched products")
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
                // Handle JSON response (e.g., error)
                
                document.getElementById("alertMessage").innerHTML=data.message
                
                clearAlert()
                // You can handle the JSON data here, e.g., display an error message
              } else {
                // Handle HTML response
                document.getElementById('pageContent').innerHTML = data;
                searchProduct()
                viewProduct()
                
              }
            
        })
        .catch((error)=>{
           console.log(er.message)
           window.location.href='/admin/500'

        })

    })
}