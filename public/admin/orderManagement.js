let totalpages
let currentPage

function listOrders(){
    fetch('/admin/listOrders')
    .then(response=>{
        if(response.ok) return response.text()
        throw new Error('unable to connect to the server')
    })
    .then(html=>{
        pageContent.innerHTML=html
        totalpages=document.getElementById("totp").value
        currentPage = document.getElementById("cur").value
        updateOrderPagination()

    })
    .catch((er)=>{
        console.log(er)
        window.location.href='/admin/500'
    })
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
            throw new Error(`HTTP error! Status: ${response.status}`);
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
    .catch(error => {
        
        window.location.href='/admin/500'
        console.error('Fetch error:', error);
    });
}

function viewOrder(orderId){
 
    fetch(`/admin/viewOrder?orderId=${orderId}`)
    .then(response=>{
        if(response.ok) return response.text()
        throw new Error('unable to connect to the server')
    })
    .then(html=>{
        pageContent.innerHTML=html
    })
    .catch((error)=>{
        window.location.href='/admin/500'
        console.log(error)
    })

}

function updateOrderStatus(elem){

    const productId=elem.getAttribute('productId')
    const orderId=elem.getAttribute('orderId')
 
    const newStatus=document.getElementById('select'+productId).value
    const oldStatus=document.getElementById('select'+productId).getAttribute('oldData')

    if(newStatus!=oldStatus){

        fetch(`/admin/updateOrderStatus`,{
            method:'PATCH',
            body:JSON.stringify({
                productId:productId,
                orderId:orderId,
                newStatus:newStatus
            }),
            headers:{'Content-Type':'application/json'}
        })
        .then(response=>{
            if(response.ok) return response.json()
            throw new Error('unable to connect to the server')
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
    }
}
