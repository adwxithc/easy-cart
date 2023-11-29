    const confirmModal = document.getElementById("confirmationModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const confirmBtn = document.getElementById("confirmBtn");

    // Open the modal
    // openModalBtn.onclick = function() {
    //     modal.style.display = "block";
    // }

    function remove(productId){
        confirmModal.style.display = "block";
        confirmModal.setAttribute('product',productId)

            // Close the modal when the close button is clicked
    closeModalBtn.onclick = function() {
        confirmModal.style.display = "none";
    }

    // Close the modal when the user confirms
    confirmBtn.onclick = function() {
        confirmModal.style.display = "none";
        const id=confirmModal.getAttribute('product')
        removeFromCart(id)
       
        // You can add your confirmation logic here
    }

    // Close the modal if the user clicks outside of it
    // window.onclick = function(event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //     }
    // }

    }






function removeFromCart(productId){
    
    fetch(`/api/removeFromCart?productId=${productId}`,{
        method:'DELETE',

    })
    .then(response=>{
        if(response.ok){
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
              return response.json(); // Parse JSON response
            } else {
              return response.text(); // Assume HTML content
            }
        }
        throw new Error('unable to connect to the server')
    })
    .then(data=>{
        if (typeof data === 'object') {
            showModal(data.message)
            setTimeout(()=>{
                closeModal()
            },1100)
    
            const id =productId.toString().trim()
            document.getElementById(id).classList=''
            document.getElementById(id).style.display='none'
            updateCartBadge()
            updateCartAmounts()
            // ---------finding total value at chechout
            showCartOrderSummery()
            if(!data.cartLength>0){
                document.getElementById('cartDisplay').innerHTML=`<div class=" col-lg-9 mx-auto">
                <div class="blog_right_sidebar">
                <div style="width: 100%; height: 100%;" class="p-3">
                    <div class="d-flex justify-content-center">
                    <lottie-player src="https://lottie.host/a2880a07-9c87-4656-8bca-df949aacd6ef/YYroJ35IzS.json" background="##FFFFFF" speed="1" style="width: 300px; height: 300px" loop  autoplay direction="1" mode="normal"></lottie-player>

                    </div>
                   
                   <div class="empty-cart-container">
                    <div>
                        <h5 class=""> Your cart is empty..!</h5>
                       
                    </div>
                    <div class="p-3">
                        <a class="darkBtn" href="/">shop now</a>
                    </div>
            
                   </div>
                   
                </div>
            </div>
            </div>`
            }

        }else{
            window.location.href='/login'
        }

       
    })
    .catch((er)=>{
 
        console.log(er.message)

    })
}

function inc(id){
    const result = document.getElementById(id);
     const sst = result.value; 
     
     
     if( !isNaN( sst )){

        const p_id=id.slice(1)

        result.value++;
        updateCart(p_id)
         
        
     }
     return false;
}

function dec(id){
    const result = document.getElementById(id);
    const sst = result.value; 
    if( !isNaN( sst ) && sst > 0 ){

        const p_id=id.slice(1)

        result.value--;
        updateCart(p_id)
         
         

    }
    return false;
}

function updateCart(productId){

    const oldQuantity=document.getElementById('old'+productId).value
    const newQuantity=document.getElementById('q'+productId).value
    if(newQuantity<0){
        document.getElementById('old'+productId).value=oldQuantity
        document.getElementById('q'+productId).value=oldQuantity
        return
    }
    let op
    let diff=newQuantity-oldQuantity
    if(diff>0) op='inc'
    else{
        diff=Math.abs(diff)
         op='dec'
        }
    

    fetch('/api/updateCart',{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ productId:productId,quantity:diff,operation:op})
    })
    .then(response=>{
        if(response.ok) return response.json()
        throw new Error('unable to connect to server')
    })
    .then(data=>{
        
        document.getElementById('old'+productId).value=data.quantity
        document.getElementById('q'+productId).value=data.quantity
        updateCartAmounts()

        // finding total value at checkout
        showCartOrderSummery()
    })
    .catch((er)=>{
        console.log(er)
    })
  

}

function updateCartAmounts(){
    if(!(document.querySelector('.total'))) return;
    const items=document.querySelectorAll('.cart-item')
    document.querySelector('.total').innerHTML=`Total(${items.length}units)`

    let grandTotal=0
    for(let item of items){
      
        const price =parseFloat(item.querySelector('.amount').textContent.trim())
        const quantity=parseFloat(item.querySelector('.qty').value.trim())
       

        const itemTotal=price*quantity
        grandTotal+=itemTotal

        item.querySelector('.itemTotal').innerHTML=`Total  :$ ${itemTotal}`
    }
    document.getElementById('cartTotal').innerHTML=grandTotal
    document.getElementById('grandTotal').innerHTML=grandTotal
}
updateCartAmounts()


