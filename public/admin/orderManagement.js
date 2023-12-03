let totalpages
let currentPage

function listOrders(){
    fetch('/admin/listOrders')
    .then(response=>{
        if(response.ok) return response.text()
        throw { status: response.status, data: response.json() };
    })
    .then(html=>{
        pageContent.innerHTML=html
        totalpages=document.getElementById("totp").value
        currentPage = document.getElementById("cur").value
        updateOrderPagination()

    })
    .catch(handleError)
}


function updateOrderPagination(){




      const prev=document.getElementById('prevOrders')  
      const next=document.getElementById('nextOrders')
      const currentBtn=document.getElementById('currentorders')
        
    prev.disabled= currentPage==1 ;
    next.disabled= currentPage == totalpages;
    currentBtn.textContent=currentPage;
}

function prevOrders(){
    if (currentPage > 1) {
                
                
        currentPage--;
        updateOrderPagination();
        fetchDataForOrderPage(currentPage);
    }
}

function nextOrders(){

    if ( Number(currentPage) < Number(totalpages)) {
      
        currentPage++;
        
        updateOrderPagination();

        fetchDataForOrderPage(currentPage);
    }
}

function fetchDataForOrderPage(Page){
           
           
    const url = `/admin/listOrders?page=${Page}`;

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

         totalpages=document.getElementById("totp").value
         currentPage = document.getElementById("cur").value
        updateOrderPagination()


    })
    .catch(handleError);
}

function viewOrder(orderId){
 
    fetch(`/admin/viewOrder?orderId=${orderId}`)
    .then(response=>{
        if(response.ok) return response.text()
        throw { status: response.status, data: response.json() };
    })
    .then(html=>{
        pageContent.innerHTML=html
    })
    .catch(handleError)

}

function updateOrderStatusByAdmin(elem){

    const productId=elem.getAttribute('productId')
    const orderId=elem.getAttribute('orderId')
 
    const newStatus=document.getElementById('select'+productId).value
    const oldStatus=document.getElementById('select'+productId).getAttribute('oldData')


    if(newStatus!==oldStatus){

        fetch(`/admin/updateOrderStatus`,{
            method:'PATCH',
            body:JSON.stringify({
                productId:productId,
                orderId:orderId,
                newStatus:newStatus,
               
            }),
            headers:{'Content-Type':'application/json'}
        })
        .then(response=>{
            if(response.ok) return response.json()
            throw { status: response.status, data: response.json() };
        })
        .then(data=>{
            if(data.updated){
                Swal.fire({
                   
                    icon: 'success',
                    text: `${data.message }`,
                    showConfirmButton: false,
                    timer: 1500,
                    coustomClass:{
                        content:'set-color'
                    }
                  })
                  document.getElementById('select'+productId).setAttribute('oldData',newStatus)
                  if(newStatus=='Canceled') document.getElementById('select'+productId).setAttribute('disabled','disabled')

            }else{
                Swal.fire({
                    
                    icon: 'error',
                    text: `${data.message}`,
                    showConfirmButton: false,
                    timer: 1500,
                    coustomClass:{
                        content:'set-color'
                    }
                  })

            }

            
        })
        .catch(handleError)
    }
}

function updateReturnStatus(elem){
    const productId=elem.getAttribute('productId')
    const orderId=elem.getAttribute('orderId')
 
    const newReturnStatus=document.getElementById('ret'+productId).value
    const oldReturnStatus=document.getElementById('ret'+productId).getAttribute('oldData')

    if(newReturnStatus!==oldReturnStatus){

        fetch(`/admin/updateReturnStatus`,{
            method:'PATCH',
            body:JSON.stringify({
                productId:productId,
                orderId:orderId,
                newReturnStatus:newReturnStatus,
               
            }),
            headers:{'Content-Type':'application/json'}
        })
        .then(response=>{
            if(response.ok) return response.json()
            throw { status: response.status, data: response.json() };
        })
        .then(data=>{
            if(data.success){
                Swal.fire({
                   
                    icon: 'success',
                    text: `${data.message }`,
                    showConfirmButton: false,
                    timer: 1500,
                    coustomClass:{
                        content:'set-color'
                    }
                  })
                  document.getElementById('ret'+productId).setAttribute('oldData',newReturnStatus)
                  if(newReturnStatus=='returned') document.getElementById('ret'+productId).setAttribute('disabled','disabled')


            }else{
                Swal.fire({
                    
                    icon: 'error',
                    text: `${data.message}`,
                    showConfirmButton: false,
                    timer: 1500,
                    coustomClass:{
                        content:'set-color'
                    }
                  })

            }
        })
        .catch(handleError)
    }

}
