
let currentPage,totalpages;


function updateUserOrderPagination(){


    const prevOrder=document.getElementById('prevOrder')  
    const nextOrder=document.getElementById('nextOrder')
   
      
  prevOrder.disabled= currentPage==1 ;
  nextOrder.disabled= currentPage == totalpages;
}

function prevOrder(){
  updatePageParameters()
  if (currentPage > 1) {
              
              
      currentPage--;
      updateUserOrderPagination();
      fetchnextOrders(currentPage);
  }
}

function nextOrder(){
  
  
  updatePageParameters()

  if ( Number(currentPage) < Number(totalpages)) {
    
      currentPage++;
      
      updateUserOrderPagination();

      fetchnextOrders(currentPage);
  }
}
function fetchnextOrders(page){
window.location.href=`/api/orders?page=${page}`

}
function updatePageParameters(){
    currentPage=document.getElementById('cur').value
    totalpages=document.getElementById('total').value
}

updateOrderStatus(document.getElementById('orderStatus')?.value)


function updateOrderStatus(status){
    if(status){
      
      const progressItems = document.querySelectorAll('#progress-bar li');
      progressItems.forEach(item => {
          item.classList.remove('step-done', 'step-active');
          item.classList.add('step-todo');
      });

        if (status === "Pending") {
          for(let i=0;i<=0;i++){
            progressItems[i].classList.remove('step-todo');
            progressItems[i].classList.add('step-done');
          }
          progressItems[1].classList.remove('step-todo');
          progressItems[1].classList.add('step-active');
      } else if (status === "Processing") {
        for(let i=0;i<=1;i++){
          progressItems[i].classList.remove('step-todo');
          progressItems[i].classList.add('step-done');
        }
        progressItems[2].classList.remove('step-todo');
        progressItems[2].classList.add('step-active');
      } else if (status === "Shipped") {
        for(let i=0;i<=2;i++){
          progressItems[i].classList.remove('step-todo');
          progressItems[i].classList.add('step-done');
        }
        progressItems[3].classList.remove('step-todo');
        progressItems[3].classList.add('step-active');
      } else if (status === "Delivered") {
        for(let i=0;i<=3;i++){
          progressItems[i].classList.remove('step-todo');
          progressItems[i].classList.add('step-done');
        }
        progressItems[4].classList.remove('step-todo');
        progressItems[4].classList.add('step-active');
      } else if (status === "Canceled") {
        for(let i=2;i<4;i++){
          progressItems[i].style.display='none';
        }
        progressItems[0].classList.remove('step-todo');
        progressItems[0].classList.add('cancel-done');
        // progressItems[1].style.display='table-cell';
        progressItems[1].textContent='Canceled';
        progressItems[1].classList.remove('step-todo');
        progressItems[1].classList.add('cancel-done');
      }

    }
}

function cancelOrder(orderId,productId){

  fetch(`/api/cancelOrder`,{
    method:'PATCH',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({orderId:orderId,productId:productId})
  })
  .then(response=>{
    if(response.ok) return response.json()
    throw new Error('unable to connect to the server')
  })
  .then(data=>{
    if(data.canceled){

      showModal(data.message)
      updateOrderStatus('Canceled')
      document.getElementById('cancelOrderH5').style.display='none'
    }else{
      showModal(data.message)
    }
    
  })
}