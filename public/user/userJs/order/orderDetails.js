

//FUNCTION TO UPDATE PROGRESS BAR
function updateProgress(width, status,stage=null) {
const progressBar = document.getElementById('progress');
const statusText = document.getElementById('statusText');
    progressBar.style.width = width;
    statusText.innerText = status;
    if(stage){
    document.getElementById(stage).style.backgroundColor = 'rgb(11, 192, 11)';
    }
}

//SHOWING CANCELED ORDER PROGRESS BAR
function showOrderCancelProgress(){
  const progressBar = document.getElementById('progress');
  document.getElementById('stage-0').style.backgroundColor='red'
  progressBar.style.backgroundColor='red'
  setTimeout(() => {
  updateProgress('100%', 'Canceled');
  }, 1000);
}

//SHOWING RETURN PROGRESS

function showReturnProgress(status){
  if(status=='returnPlaced'){
    setTimeout(() => {
    updateProgress('5%', 'Return Placed','stage-0'); 
    }, 200);

 }else if(status=='outForPick'){
    setTimeout(() => {
      updateProgress('5%', 'Return Placed','stage-0');
      }, 200);

      setTimeout(() => {
      updateProgress('50%', 'Out For Pick','stage-1');
      }, 2500);


  }else if(status=='returned'){
    

    setTimeout(() => {
      updateProgress('5%', 'Return Placed','stage-0');
      }, 200);

      setTimeout(() => {
      updateProgress('50%', 'Out For Pick','stage-2');
      }, 2500);
      setTimeout(() => {
      updateProgress('100%', 'returned','stage-3');
      }, 4500);

  }
}

//SHOWING PROGRESS BAR OF ORDER
function showProgress(status){

  if(status=='Pending'){
    setTimeout(() => {
    updateProgress('25%', 'Pending','stage-1');
    }, 1000);

  }else if(status=='Processing'){
    setTimeout(() => {
      updateProgress('25%', 'Pending','stage-1');
      }, 1000);

      setTimeout(() => {
      updateProgress('50%', 'Processing','stage-2');
      }, 3000);


  }else if(status=='Shipped'){
    

    setTimeout(() => {
      updateProgress('25%', 'Pending','stage-1');
      }, 1000);

      setTimeout(() => {
      updateProgress('50%', 'Processing','stage-2');
      }, 3000);
      setTimeout(() => {
      updateProgress('75%', 'Shipped','stage-3');
      }, 5000);

  }else if(status=='Delivered'){
    setTimeout(() => {
    updateProgress('25%', 'Pending','stage-1');
    }, 1000);

    setTimeout(() => {
        updateProgress('50%', 'Processing','stage-2');
    }, 3000);

    setTimeout(() => {
        updateProgress('75%', 'Shipped','stage-3');
    }, 5000);

    setTimeout(() => {
        updateProgress('100%', 'Delivered','stage-4');
    }, 7000);
    setTimeout(()=>{
      document.getElementById('stage-4').style.backgroundColor = 'rgb(11, 192, 11)';
    },8000)

  }
}
//SETTING PROGRESS BAR ACCORDING TO THE ORDER STATUS

window.onload = function() {


    const status=document.getElementById('orderStatus').value
    const returnStatus=document.getElementById('returnStatus')?.value
    if(returnStatus){
      showReturnProgress(returnStatus)
    }else if(status!='Canceled'){
      
      showProgress(status)
    }else{
      showOrderCancelProgress()
    }


  };
//DYNAMICALY CREATING PROGRESS BAR IN CANCEL ORDER
  function setUpCancelOrderProgressBar(){
    
    document.getElementById('orderProgressBar').remove()
    const div=document.createElement('div')
    div.innerHTML=`
                  <div class="stages">
                    <div class="d-flex justify-content-between">
                        <span class="progress-stage stage-0" id="stage-0"></span>
                        <span class="progress-stage stage-4" id="stage-4"></span>
                    </div>

                    <div class="progress">
                        <div id="progress" class="progress-bar" role="progressbar" style="width: 0%; transition: width 2s ease-in-out;"></div>
                    </div>

                </div>
                <div class="d-flex justify-content-between mt-3">
                  <span>Placed</span>

                  <span>Canceled</span>

                </div>
                <div id="statusText" style="margin-top: 20px;">Order Placed</div>
  
    `
    document.getElementById('progressDiv').appendChild(div)
  }
//FUNCTION TO CANCEL ORDER
  function cancelOrder(orderId,productId){

    fetch(`/api/cancelOrder`,{
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({orderId:orderId,productId:productId})
    })
    .then(response=>{
      if(response.ok) return response.json()
      throw { status: response.status, data: response.json() };
    })
    .then(data=>{
      if(data.canceled){
  
        showModal(data.message)
        setUpCancelOrderProgressBar()
        showOrderCancelProgress()
        document.getElementById('invoice').remove()
        document.getElementById('cancelOrderH5').style.display='none'
  
      }else if(data.singleCancelNotEligible){
        const modal=document.getElementById('cancelNotEligibleModal')
        modal.querySelector('#notEligibleMessage').innerHTML=data.message
        showOrderedItems(orderId)
        modal.style.display='block'
      }
      
    })
    .catch(handleError)
  }
  
  //SHOW ALL PRODUCTS IN THAT PARTICULAR ORDER IN CASE SINGLE ORDER CANCELATION DOESN'T SATISFY APPLIED COUPON MIN AMOUNT
  function showOrderedItems(orderId){
    fetch(`/api/orderItems?orderId=${orderId}`)
    .then(response=>{
      if(response.ok) return response.json()
      throw { status: response.status, data: response.json() };
    })
    .then(data=>{
      if(data.orderData){
        let OrderedItems=document.getElementById('OrderedItems')
        OrderedItems.innerHTML=''
        for(let item of data.orderData.items){
          let price=`Price :<span class="darkText amount" >&#8377; ${item.price}</span>`
          if(item.discount && item.discount>0){
            price=`
            Price :<span class="darkText amount" > ${item.price}</span>
            <h6><span id="offer">${item.discount}</span>% off</h6>
            <del class="orginalPrice">MRP <span >${item.MRP}</span></del>
            `
          }
          const containerDiv=document.createElement('div')
          containerDiv.classList='row singleItem'
         
          containerDiv.innerHTML=`
          <div class="col-lg-4 pr-auto">
                <div class='imgContainerDiv'>
                <a href='/productDetails?id=${item.product._id}' target='_blank'><img src="/static/productImages/${item.product.images[0]}" alt="" class='itemImage'></a>
                </div>
              </div>
              <div class="col-lg-8">
                <div>
                <p class='darkText'>${item.product.name}</p>
                ${price}
                </div>
  
              </div>
          `
  
          OrderedItems.appendChild(containerDiv)
        }
        const total=document.createElement('div')
        total.innerHTML=`
          <h6 class='d-flex justify-content-around '><span>Coupone Discount:</span><span>${data.orderData.couponeDiscount}%</span></h6>
          <h6 class='d-flex justify-content-around '><span>Total : </span><span>${data.orderData.totalAmount}</span></h6>
        `
        OrderedItems.appendChild(total)
      }
      
    })
    .catch(handleError)
  }
  
  //REQUEST TO SERVER FOR CANCELING WHOLE ORDER
  function cancenlWholeOrder(orderId){
   
  
      fetch(`/api/cancenlWholeOrder`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({orderId:orderId})
      })
      .then(response=>{
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };
      })
      .then(data=>{
        if(data.canceled){
          Swal.fire({
            icon: "success",
            title: data.message,
            showConfirmButton: false,
            timer: 1500
          });
          document.getElementById('cancelNotEligibleModal').style.display='none'
            setUpCancelOrderProgressBar()
            showOrderCancelProgress()
            document.getElementById('cancelOrderH5').style.display='none'

        }
        
      })
      .catch(handleError)

  }

  //FUNCTION TO RETURN ORDER
  function returnOrder(orderId,productId){
    askReasonForReturn(orderId,productId)

  }

  function askReasonForReturn(orderId,productId){
     // Swal.fire configuration with custom classes and styling
     Swal.fire({
      title: 'Request for Return',
      html: `
        <div class="return-request-modal">
          <label for="returnReason" class="return-reason-label">Please provide a reason for your return:</label>
          <textarea id="returnReason" class="return-reason-textarea" placeholder="Enter your reason here..." rows="5"></textarea>
          <div id="returnReasonValidationError" class="swal2-validation-error"></div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Request',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      customClass:{
        confirmButton:'returnRequestSubmit',
        cancelButton:'returnRequestCancel'
      },
      preConfirm: async() => {
        const returnReason = document.getElementById('returnReason').value;
  
        // Check if the return reason is empty
        if (!returnReason) {
          document.getElementById('returnReasonValidationError').innerText = 'Please enter a reason for the return.';
          return false; // Prevent the modal from closing
        }
        
        return true
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(() => {
      const returnReason = document.getElementById('returnReason').value;
      if (!returnReason) {
        document.getElementById('returnReasonValidationError').innerText = 'Please enter a reason for the return.';
        return false; // Prevent the modal from closing
      }
      sendReturnRequest(orderId,productId,returnReason)
     
    });
    
  }


  async function sendReturnRequest(orderId,productId,returnReason){
    fetch(`/api/returnOrder`,{
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({productId:productId,orderId:orderId,returnReason:returnReason})

    })
    .then(response=>{
      if(response.ok) return response.json()
      throw { status: response.status, data: response.json() };
    })
    .then(data=>{
      
      if(data.success){
        
        Swal.fire({
          title: 'Return Request Submitted!',
          text: data.message,
          icon: 'success',
        })
        .then(()=>{
          window.location.href=`/api/orderDetails?orderId=${orderId}&productId=${productId}`

        });
      }
      
    })
    .catch(handleError)
  }