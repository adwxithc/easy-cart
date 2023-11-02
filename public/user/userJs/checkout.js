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
    addressElement.classList.add('addressRadio', 'address', 'd-flex', 'my-3', 'addressOption','opts');
    addressElement.id = addressData._id;
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


function calculateOrderSummery(){
  if(document.getElementById('productQty')){
  const productQty=parseInt(document.getElementById('productQty').value)
  const price=parseFloat(document.getElementById('productPrice').innerHTML)

  const total=productQty*price
  let deliveryCharge=0
  if(total<500){
    deliveryCharge=40
  }

  document.getElementById('checkoutTotal').innerHTML='Rs.'+total
  document.getElementById('deliveryCharge').innerHTML='Rs.'+deliveryCharge
  document.getElementById('grandTotal').innerHTML='Rs.'+(total+deliveryCharge)
}
}
calculateOrderSummery()


function showCartOrderSummery(){
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
  if(grandTotal<500){
    deliveryCharge=40
  }
  document.getElementById('checkoutTotal').innerHTML='Rs.'+grandTotal
  document.getElementById('deliveryCharge').innerHTML='Rs'+deliveryCharge
  document.getElementById('grandTotal').innerHTML='Rs'+(grandTotal+deliveryCharge)
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
  const cartAtCheckout=document.getElementById('cartAtCheckout')
  let confirmData;
  //checking whether it is checkout for cart or single product
  if(cartAtCheckout){
    const address=document.getElementById('selectedAddress').getAttribute('for')
    
     confirmData={
      address:address,
      paymentMethod:paymentMethod
    }

  }else{
    const orderdProduct=document.getElementById('orderdProduct')
    if(orderdProduct){
      const address=document.getElementById('selectedAddress').getAttribute('for')
      const productQty=document.getElementById('productQty').value

      const productId=orderdProduct.getAttribute('data')
      
       confirmData={
        address:address,
        productQty:productQty,
        productId:productId,
        paymentMethod:paymentMethod
      }

      
    }

  }

  fetch('/api/confirmOrder',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(confirmData)
  })
  .then(response=>{
    if(response.ok) return response.json()
    throw new Error('unable to connect to the server')
  })
  .then(data=>{
    if(data.orderConfirmed){
        window.location.href=`/api/orderResponse?order=${data.order}`
    }else{
      showModal(data.message)
    }
   
  })
  .catch((er)=>{
    console.log(er)
    showModal('Something went wrong')
  })

}

