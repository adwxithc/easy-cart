    // global constands
    const modal=document.getElementById('modal')
    
    
    // Get references to the images and the product preview element
    const thumbnailImages = document.querySelectorAll('.thumbnailImg');
    const productPreview = document.querySelector('.productPreView');
    
    // Add a click event listener to each thumbnail image
    thumbnailImages.forEach((thumbnailImg, index) => {
        thumbnailImg.addEventListener('mouseover', () => {
            // Get the source (src) of the clicked image
            const imageSource = thumbnailImg.getAttribute('src');
    
            // Update the source (src) of the product preview image
            productPreview.setAttribute('src', imageSource);

            //image zoome on hover

            var options2 = {
       
                fillContainer: true,
                zoomPosition:'original',
                offset: {vertical: 0, horizontal: 10},
               
            };
        
            // Create a new instance of ImageZoom
            new ImageZoom(document.getElementById('img-container'), options2);
    
            // Optionally, you can also add a fade-in effect, or any other visual enhancements
            // to improve the user experience when the image changes.
        });
    });


    //image zoome on hover

    var options2 = {
       
        fillContainer: true,
        zoomPosition:'original',
        offset: {vertical: 0, horizontal: 10},
    
       
    };

    // Create a new instance of ImageZoom
    new ImageZoom(document.getElementById('img-container'), options2);
  


    
    //registration
function validateForm(){
    
    
    const fname=document.getElementById('fname').value;
    const sname=document.getElementById('lname').value;

    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rpassword = document.getElementById('rePassword').value;

    

    const rerrorPassword = document.getElementById('rePasswordError');
    const errorUsername = document.getElementById('emailError');
    const errorPassword = document.getElementById('passwordError');
    const errorFname = document.getElementById('fnameError');
    const errorSname = document.getElementById('lnameError');

    
  
    const emailExpr= /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,4}$/;
    // const phoneExpr=/^[0-9]{10}$/
    let isValid = true;
  
    document.getElementById('email').addEventListener('focusin',()=>{
        errorUsername.innerHTML = ''; 
    })
    document.getElementById('password').addEventListener('focusin',()=>{
        errorPassword.innerHTML = '';
    })
    document.getElementById('rePassword').addEventListener('focusin',()=>{
    rerrorPassword.innerHTML = '';
    })
   
    document.getElementById('fname').addEventListener('focusin',()=>{
        errorFname.innerHTML = '';
    })
    document.getElementById('lname').addEventListener('focusin',()=>{
        errorSname.innerHTML = '';
    })

   
  
    // user
    if(fname.trim() === '') {
        errorFname.innerHTML = '*First name is required.';
        
        isValid = false;
    }
    if(sname.trim() === '') {
        errorSname.innerHTML = '*Last name is required.';
        
        isValid = false;
    }
    if(username.trim() === '') {
        errorUsername.innerHTML = '*Email is required.';
        
        isValid = false;
    }
    else if(!(emailExpr.test(username))){
        errorUsername.innerHTML = '*Invalid Email format';
        isValid = false;
    } else {
        errorUsername.innerHTML = ''; 
    }

    //match check
  if(password!=rpassword){
    errorPassword.innerHTML = '*You entered diffrent password.';
   
      isValid = false;
  }
  
  
  
  
    //passwd
    if (password.trim() === '') {
        errorPassword.innerHTML = '*Password is required.';
        isValid = false;
    } 
    else if(password.length<5)
    {
        errorPassword.innerHTML = '*password should have more than 4 charactors';
        isValid = false;
    } 
    else if(password.length>15)
    {
        errorPassword.innerHTML = '*password should have less than 15 charactors';
        isValid = false;
    } else {
        errorPassword.innerHTML = '';
    }

    //re enterd password
if (rpassword.trim() === '') {
    rerrorPassword.innerHTML = '*Password is required.';
    isValid = false;
} 
else if(rpassword.length<5)
{
    rerrorPassword.innerHTML = '*password should have more than 4 charactors';
    isValid = false;
} 
else if(rpassword.length>15)
{
    rerrorPassword.innerHTML = '*password should have less than 15 charactors';
    isValid = false;
} else {
    rerrorPassword.innerHTML = '';
}
  
    


  
    return isValid;
  }




//  --------------------------------------------- modal----------------------------------

  function showModal(message) {
    // const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalContent = document.querySelector('.modal-content');

    modalMessage.innerText = message;
    modal.style.display = 'block'; // Show the modal

    // Use a setTimeout to add the 'show' class after a slight delay
    setTimeout(function () {
        modalContent.classList.add('show');
    }, 10); // 10ms delay



}

function closeModal() {
    // const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.remove('show'); // Remove the 'show' class
    modal.style.display = 'none'; // Hide the modal
}

//   Close the modal if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }


// ----------------------------update cart count on cart icon badge in nav bar-------------------


function updateCartBadge(numberOfItemsInCart){


    const cartBadge= document.querySelector('.cBadge')
   
    cartBadge.style.display='flex'
    cartBadge.textContent=numberOfItemsInCart
}

fetch('/api/cartCount')
.then(response=>{
    if(response.ok) return response.json()
    throw new Error('unable to get cart item count')
})
.then(data=>{
    if(data.count) updateCartBadge(data.count)
})
.catch((er)=>{
    console.log(er.message)
})


// --------------------------------------------------------remove error message-----------------------------------
       


document.getElementById('mainContainer').addEventListener('click',(e)=>{
   

    if(e.target.classList.contains('productDetails')){
        if(e.target.id=='buyNow'){
            buyNow()
        }
    }
    
    // USER PROFILE ACTIONS
    if(e.target.classList.contains('profileAction')){

        if(e.target.id=='cancelEdit'){

            cancelEdit()
    
        }else if(e.target.id=='editProfile'){
    
            editProfile()
    
        }else if(e.target.id=='save'){
    
            validateEditUserInfo()
    
        }else if(e.target.id=='manageAddress'){
    
            getManageAddress()
    
        }else if(e.target.id =='saveAddress'){
    
            validateAddress(addNewAddress)
    
        }else if(e.target.id =='addAddress'){
    
            setAddAddress()
        }else if(e.target.id=='cancelAddAddress'){
            unsetAddAddress()
        }else if(e.target.classList.contains('deletAddress')){
            removeAddress(e.target.id)
        }else if(e.target.id=='updateAddress'){
            validateAddress(updateAddress)
        }else if(e.target.id=='changePassword'){
            changePassword()
        }else if(e.target.id=='updatePassword'){
            updatePassword()
        }else if(e.target.id=='walletIcon' || e.target.id=='wallet'){
            showWallet()
        }else if(e.target.id=='addToWallet' || e.target.id=='addMoneyToWallet'){
            addMoneyToWallet()
        }

    }

    
    // CHECKOUT ACTIONS
    if(e.target.classList.contains('checkoutActions')){
    
        if(e.target.classList.contains('addressRadio')){
            
           setDeliveyHere(e.target)

        }else if(e.target.id=='deliveyHere'){
            showProductDetails()
        }else if(e.target.id=='changeSelectedAddress'){
            changeAddress()
        }else if(e.target.id=='continueOrderSummery'){
            
            proceedToPaymentOptions()
            
        }else if(e.target.classList.contains('paymentMethod')){
            allowPlaceOrder(e.target)
        }else if(e.target.classList.contains('confirmOrder')){
            confirmOrder(e.target.id)
        }else if(e.target.classList.contains('selectCoupone')){
            selectCoupone(e.target.getAttribute('couponeCode'))
        }else if(e.target.id=='applyCoupone'){
            applyCoupone()
        }else if(removeCoupone){
            removeCoupone()
        }
    }


    //ORDER ACTIONS
    if(e.target.classList.contains('orderAction')){
        
        if(e.target.id=='prevOrder'){
            prevOrder()
        }else if(e.target.id=='nextOrder'){
            
            nextOrder()
        }else if(e.target.id=='cancelOrder'){
            Swal.fire({
                title: "Cancel Order",
                text: "Are you sure you want to cancel your order? This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#797a7a",
                confirmButtonText: "Yes, cancel my order",
                cancelButtonText: "No, keep my order",
              }).then((result) => {
                if (result.isConfirmed) {
                    cancelOrder(document.getElementById('orderId')?.value,document.getElementById('productId')?.value)

                }
              });

        }else if(e.target.id=='closeNotEligibleModal'){
            document.getElementById('cancelNotEligibleModal').style.display='none'
        }else if(e.target.id=='cancelWholeOrder'){
            
            cancenlWholeOrder(document.getElementById('orderId')?.value)

        }else if(e.target.id=='returnOrder'){
            
            returnOrder(e.target.getAttribute('orderId'),e.target.getAttribute('productId'))
        }

    }else if(e.target.classList.contains('searchAction')){

        //SEARCH ACTION
        if(e.target.id=='prevProducts'){
            prevProducts()
        }else if(e.target.id=='nextProducts'){
            
            nextProducts()
        }else if(e.target.classList.contains('easyAddToCart')){
            const productId=e.target.getAttribute('productId')
            addSingleProductToCart(productId,1)
        }
    }

},true)
