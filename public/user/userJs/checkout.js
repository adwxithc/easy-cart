function changeLabelColor(radioButton) {
  
    const labels = document.querySelectorAll(".Radio");
    labels.forEach(label => {
      if (label.querySelector("input:checked") === radioButton) {
        label.classList.add("selectAddress");
      } else {
        label.classList.remove("selectAddress");
      }
    });
  }

  function createAddressOption(addressData){


    const addressElement = document.createElement('label');
    addressElement.classList.add('address', 'Radio', 'address', 'd-flex', 'my-3', 'addressOption','opts');
    // addressElement.id = addressData._id;
    addressElement.setAttribute('for',addressData._id)
    const innerHTML=` <div class="flex-grow-0 d-flex  align-items-center p-2" > <input type="radio" name="address" class="addressRadio checkoutActions" id="${addressData._id}" onclick="changeLabelColor(this)"></div>

    <div class="addressRadio p-3 flex-grow-1" id="${addressData._id}">
        
        
        <div>
            <div class="d-flex head"><h6 class="p-1 mr-1">${addressData.name}</h6><h6 class="p-1">${addressData.mobile}</h6></div>
        </div>
        <p class="p-1 infos">
            ${ addressData.area}, ${addressData.locality}, ${addressData.city}, ${addressData.state}-<span class="text-dark ">${addressData.pincode}</span> 
        </p>
        <div class="d-flex justify-content-end"><a href='/editAddress?id=${addressData._id}' class="px-2 opt-link editAddress" >Edit</a></div>
    </div>`
  
    addressElement.innerHTML=innerHTML
    return addressElement;
    
}

function setDeliveyHere(address){
    const deliveyHere =document.getElementById("deliveyHere")
    deliveyHere.style.display = "inline";
    deliveyHere.setAttribute('AddressId',address.id)
}




function showProductDetails(){
    let selectedAddress;
    const addresses=document.querySelectorAll('.opts')
    for(let address of addresses){
     
        if(address.classList.contains('selectAddress')){
          selectedAddress=address.cloneNode(true)
        }
        
    }
   if(selectedAddress){

    selectedAddress.id='selectedAddress'

    const containerDiv = document.createElement('div');
    containerDiv.className='blog_right_sidebar'
    containerDiv.id='selectedAddressDiv'

    containerDiv.appendChild(selectedAddress);

    const button = document.createElement('button');
    button.classList.add('darkBtn','checkoutActions')
    button.id='changeSelectedAddress'
    button.textContent = 'CHANGE';
    containerDiv.appendChild(button);


    document.getElementById('addsessSection').style.display='none'

    const targetDiv=document.getElementById('stages')
    targetDiv.insertBefore(containerDiv, targetDiv.firstChild);



    document.getElementById('orderSummeryPlaceholder').style.display='none'
    document.getElementById('orderSummeryData').style.display='block'
   }


}
function changeAddress(){

  document.getElementById('selectedAddressDiv').remove()
  document.getElementById('addsessSection').style.display='block'


  document.getElementById('orderSummeryPlaceholder').style.display='block'
  document.getElementById('orderSummeryData').style.display='none'

  document.getElementById('paymentOptionsPlaceholder').style.display='block'
  document.getElementById('paymentOptions').style.display='none'
}


function calculateOrderSummery(coupone){
    if(document.getElementById('productQty')){
    const productQty=parseInt(document.getElementById('productQty').value)
    const price=parseFloat(document.getElementById('productPrice').innerHTML)



    const total=productQty*price
    let deliveryCharge=0
    // if(total<500){
    //   deliveryCharge=40
    // }
    let discount=0
    if(coupone){
    
      discount=(total*coupone.couponeDiscount)/100;
    }

    document.getElementById('checkoutTotal').innerHTML='Rs.'+total
    document.getElementById('deliveryCharge').innerHTML='Rs.'+deliveryCharge
    document.getElementById('discount').innerHTML=discount
    document.getElementById('grandTotal').innerHTML=((total+deliveryCharge)-discount)
    // console.log(total,deliveryCharge,discount,(total+deliveryCharge)-discount)
  }
}
calculateOrderSummery()


function showCartOrderSummery(coupone){
  if(!(document.querySelector('#cartAtCheckout'))) return;
  let deliveryCharge=0

  const items=document.querySelectorAll('.cart-item')
  document.querySelector('.totalAmd').innerHTML=`Total(${items.length}units)`

  let grandTotal=0
  for(let item of items){
    
      const price =parseFloat(item.querySelector('.amount').textContent.trim())
      const quantity=parseFloat(item.querySelector('.qty').value.trim())
     

      const itemTotal=price*quantity
      grandTotal+=itemTotal

      item.querySelector('.itemTotal').innerHTML=`Total  :$ ${itemTotal}`
  }
  // if(grandTotal<500){
  //   deliveryCharge=40
  // }
  let discount=0
  if(coupone){
    
    discount=(grandTotal*coupone.couponeDiscount)/100;
  }
  document.getElementById('checkoutTotal').innerHTML='Rs.'+grandTotal
  document.getElementById('deliveryCharge').innerHTML='Rs'+deliveryCharge
  document.getElementById('discount').innerHTML=discount
  document.getElementById('grandTotal').innerHTML=((grandTotal+deliveryCharge)-discount)
}
showCartOrderSummery()



function proceedToPaymentOptions(){
  document.getElementById('paymentOptionsPlaceholder').style.display='none'
  document.getElementById('paymentOptions').style.display='block'

}

function allowPlaceOrder(element){
  const radios=document.querySelectorAll('.paymentMethod')
  for(let radio of radios){
    const PO=radio.getAttribute('data')
    document.getElementById(PO).style.display='none'
  }
  const id=element.getAttribute('data')
  document.getElementById(id).style.display='inline'
}

// ----------------------------------------------confirm the order--------------------------------------------------
function confirmOrder(paymentMethod){

  const couponeFeald=document.getElementById('couponeCode')
  const couponeCode=couponeFeald.value 
  const couponeApplied=couponeFeald.getAttribute('validcoupone')

  const address=document.getElementById('selectedAddress').getAttribute('for')
  const cartAtCheckout=document.getElementById('cartAtCheckout')
  let confirmData;
  //checking whether it is checkout for cart or single product
  if(cartAtCheckout){
    
     confirmData={
      address:address,
      paymentMethod:paymentMethod,
      cart:true
    }

  }else{
    const orderdProduct=document.getElementById('orderdProduct')
    if(orderdProduct){
      
      const productQty=document.getElementById('productQty').value

      const productId=orderdProduct.getAttribute('data')
      
       confirmData={
        address:address,
        productQty:productQty,
        productId:productId,
        paymentMethod:paymentMethod,
        
      }

      
    }

  }
   
  if(couponeApplied=='true'){
    
     confirmData['couponeCode']=couponeCode
  }

  fetch('/api/confirmOrder',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(confirmData)
  })
  .then(response=>{
    if(response.status==401){
      window.location.href='/login'
      return
  }
    if(response.ok) return response.json()
    throw { status: response.status, data: response.json() };
  })
  .then(data=>{
    if(data.orderConfirmed){

      if(data.cod || data.wallet){
        window.location.href=`/api/orderResponse?order=${data.order}`
      }else{
        console.log(data.order,data.userInfo,data.cart)
        razorpayPayment(data.order,data.userInfo,data.cart)
      }

    }else{
      showModal(data.message)
    }
   
  })
  .catch(handleError)

}


function razorpayPayment(order,userInfo,cart){

    var options = {
      "key": "rzp_test_s3jjV861Udy8by", // Enter the Key ID generated from the Dashboard
      "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "Easy Cart", //your business name
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler":function(response){
        
        verifyPayment(response,order,cart)
      },
      "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
          "name": userInfo.name, //your customer's name
          "email": userInfo.email,
          "contact": userInfo.mobile //Provide the customer's phone number for better conversion rates 
      },
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#292929"
      }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
  
}
function verifyPayment(payment,order,cart){
  fetch('/api/verifyPayment',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({payment:payment,order:order,cart:cart})
  })
  .then(response=>{
    if(response.status==401){
      window.location.href='/login'
      return
  }
    if(response.ok) return response.json()
    throw { status: response.status, data: response.json() };
  })
  .then(data=>{
    if(data.paied){
      window.open(`/api/orderResponse?order=${data.orderId}`,'_self')
    }else if(!data.success){
      showMessage(data.message)
    }
     
  })
  .catch(handleError)
}



function getTotalPrice(){

  if((document.querySelector('#cartAtCheckout'))){
  let deliveryCharge=0
  let grandTotal=0

  const items=document.querySelectorAll('.cart-item')

 
  for(let item of items){
    
      const price =parseFloat(item.querySelector('.amount').textContent.trim())
      const quantity=parseFloat(item.querySelector('.qty').value.trim())

      const itemTotal=price*quantity
      grandTotal+=itemTotal

  }
  // if(grandTotal<500){
  //   deliveryCharge=40
  // }

    return grandTotal
  }

      const productQty=parseInt(document.getElementById('productQty').value)
    const price=parseFloat(document.getElementById('productPrice').innerHTML)
  


    let total=productQty*price
    let deliveryCharge=0
    // if(total<500){
    //   deliveryCharge=40
    // }
    total+=deliveryCharge
    return total
}

async function applyCoupone(){
  couponeFeald=document.getElementById('couponeCode')
  const couponeCode=couponeFeald.value
  if(!couponeCode){
      document.getElementById('couponeError').innerHTML='Please enter a valid coupon code'
      
  }else{
    document.getElementById('couponeError').innerHTML==''
    const total=getTotalPrice()

    fetch(`/api/getCoupone`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({couponeCode:couponeCode,total:total})
    })
    .then(response=>{
      if(response.status==401){
        window.location.href='/login'
        return
    }
      if(response.ok){
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          
          return response.json(); // Parse JSON response
        } else {
           window.open('/login') // Assume HTML content
        }
      } 
      throw { status: response.status, data: response.json() };
    })
    .then(data=>{
      

      if(data.coupone){

        if(document.querySelector('#cartAtCheckout')){
          showCartOrderSummery(data.coupone)
        }else{
          calculateOrderSummery(data.coupone)
        }

          couponeFeald.setAttribute('validCoupone',true)
          document.getElementById('couponeError').innerHTML=''
          setRemoveCoupone()

          // ShowCouponeTANDC(data.coupone)
          Swal.fire({
            icon: "success",
            title: 'coupon applied',
            showConfirmButton: false, 
            timer: 1500
          
          });
        
      }else{
        Swal.fire({
          icon: "error",
          title: data.message,
          showConfirmButton: false, 
          timer: 1500
        
        });

      }
    })
    .catch(handleError)

  }
}

function setRemoveCoupone(){
  const applyCoupone=document.getElementById('applyCoupone')
  applyCoupone.innerHTML='remove'
  applyCoupone.id='removeCoupone'
  document.getElementById('couponeCode').disabled=true
  document.getElementById('coupones').style.pointerEvents = 'none'
}

function removeCoupone(){

  document.getElementById('couponeCode').setAttribute('validCoupone',false)
  document.getElementById('couponeCode').value=''
    const applyCoupone=document.getElementById('removeCoupone')
    applyCoupone.innerHTML='Apply'
    applyCoupone.id='applyCoupone'
    document.getElementById('couponeCode').disabled=false
    document.getElementById('coupones').style.pointerEvents = 'auto'

    if(document.querySelector('#cartAtCheckout')){
      showCartOrderSummery(null)
    }else{
      calculateOrderSummery(null)

    }
    Swal.fire({
      icon: "success",
      title:'coupone removed',
      showConfirmButton: false, 
      timer: 1500
    
    });
}




function selectCoupone(couponeCode){
document.getElementById('couponeCode').value=couponeCode

}


