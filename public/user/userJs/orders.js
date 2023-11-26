
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



// function cancelOrder(orderId,productId){

//   fetch(`/api/cancelOrder`,{
//     method:'PATCH',
//     headers:{'Content-Type':'application/json'},
//     body:JSON.stringify({orderId:orderId,productId:productId})
//   })
//   .then(response=>{
//     if(response.ok) return response.json()
//     throw new Error('unable to connect to the server')
//   })
//   .then(data=>{
//     if(data.canceled){

//       showModal(data.message)
//       updateOrderStatus('Canceled')
//       document.getElementById('cancelOrderH5').style.display='none'

//     }else if(data.singleCancelNotEligible){
//       const modal=document.getElementById('cancelNotEligibleModal')
//       modal.querySelector('#notEligibleMessage').innerHTML=data.message
//       showOrderedItems(orderId)
//       modal.style.display='block'
//     }else{
    
//       showModal(data.message)
//     }
    
//   })
// }

// function showOrderedItems(orderId){
//   fetch(`/api/orderItems?orderId=${orderId}`)
//   .then(response=>{
//     if(response.ok) return response.json()
//     throw new Error("can't get ordered Items")
//   })
//   .then(data=>{
//     if(data.orderData){
//       let OrderedItems=document.getElementById('OrderedItems')
//       OrderedItems.innerHTML=''
//       for(let item of data.orderData.items){
//         let price=`Price :<span class="darkText amount" >&#8377; ${item.price}</span>`
//         if(item.discount && item.discount>0){
//           price=`
//           Price :<span class="darkText amount" > ${item.price}</span>
//           <h6><span id="offer">${item.discount}</span>% off</h6>
//           <del class="orginalPrice">MRP <span >${item.MRP}</span></del>
//           `
//         }
//         const containerDiv=document.createElement('div')
//         containerDiv.classList='row singleItem'
       
//         containerDiv.innerHTML=`
//         <div class="col-lg-4 pr-auto">
//               <div class='imgContainerDiv'>
//               <a href='/productDetails?id=${item.product._id}' target='_blank'><img src="/static/productImages/${item.product.images[0]}" alt="" class='itemImage'></a>
//               </div>
//             </div>
//             <div class="col-lg-8">
//               <div>
//               <p class='darkText'>${item.product.name}</p>
//               ${price}
//               </div>

//             </div>
//         `

//         OrderedItems.appendChild(containerDiv)
//       }
//       const total=document.createElement('div')
//       total.innerHTML=`
//         <h6 class='d-flex justify-content-around '><span>Coupone Discount:</span><span>${data.orderData.couponeDiscount}%</span></h6>
//         <h6 class='d-flex justify-content-around '><span>Total : </span><span>${data.orderData.totalAmount}</span></h6>
//       `
//       OrderedItems.appendChild(total)
//     }else{
//       showModal('Something went wrong')
//     }
    
//   })
//   .catch((error)=>{
//     console.error(error)
//     showModal('Something went wrong')
//   })
// }

// function cancenlWholeOrder(orderId){
//   try {

//     fetch(`/api/cancenlWholeOrder`,{
//       method:'PATCH',
//       headers:{'Content-Type':'application/json'},
//       body:JSON.stringify({orderId:orderId})
//     })
//     .then(response=>{
//       if(response.ok) return response.json()
//       throw new Error('server communication error')
//     })
//     .then(data=>{
//       if(data.canceled){
//         Swal.fire({
//           icon: "success",
//           title: data.message,
//           showConfirmButton: false,
//           timer: 1500
//         });
//         document.getElementById('cancelNotEligibleModal').style.display='none'

//       }else{
//         showModal('Something went wrong')
//       }
      
//     })
    
//   } catch (error) {
//     console.error(error)
//     showModal('Something went wrong')
    
//   }
// }