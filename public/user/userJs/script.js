    // global constands
    const modal=document.getElementById('modal')

    // Get references to the images and the product preview element
    const thumbnailImages = document.querySelectorAll('.thumbnailImg');
    const productPreview = document.querySelector('.productPreView');
    
    function imgZoom() { 
        // Select all thumbnail images
        const thumbnailImages = document.querySelectorAll('.thumbnailImg');
        // Select the product preview image element
        const productPreview = document.getElementById('product-preview');
        // Select the container for the zoomed image
        const imgContainer = document.getElementById('img-container');
    
        // Define the options for ImageZoom
        const options2 = { 
          
            offset: { vertical: 0, horizontal: 10 },
            zoomPosition: 'original',
            zoomLensStyle: 'opacity: 0.4; background-color: white;', // Customize the zoom lens style
        };
    
        // Function to initialize ImageZoom
        const initImageZoom = (src) => {
            // Clear previous instance if exists
            imgContainer.innerHTML = `<img class="img-fluid productPreView"  id="product-preview" src="${src}" />`;
            new ImageZoom(imgContainer, options2);
        };
    
        // Initialize ImageZoom for the first time with the initial product preview source
        initImageZoom(productPreview.getAttribute('src'));
    
        // Add a mouseover event listener to each thumbnail image
        thumbnailImages.forEach((thumbnailImg) => {
            thumbnailImg.addEventListener('mouseover', () => {
                // Get the source (src) of the hovered image
                const imageSource = thumbnailImg.getAttribute('src');
                // Update the source (src) of the product preview image
                productPreview.setAttribute('src', imageSource);
                // Reinitialize ImageZoom with the new image source
                initImageZoom(imageSource);
            });
        });
    }
if(thumbnailImages.length>0) imgZoom()

    
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
    if(response.status==401){
        window.location.href='/login'
        return
    }
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
    
        }else if(e.target.hasAttribute('manageAddress')){
    
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
        }else if(e.target.hasAttribute('changePassword')){
            changePassword()
        }else if(e.target.id=='updatePassword'){
            
            updatePassword()
        }else if(e.target.hasAttribute('wallet')){
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
        }else if(e.target.classList.contains('easyAddToCart') ||e.target.hasAttribute('easyAddToCart') ){
            const productId=e.target.getAttribute('productId')
            addSingleProductToCart(productId,1)
        }
    }

},true)

function showMessage(message){
    Swal.fire({
        position:'bottom',
        html: `
            <div class="p-3 ">
                    ${message}
            </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: true,
        
      });
  }


function handleError(error) {
     
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error: Unable to reach the server.');
      // Optionally show a user-friendly message to the user
    } else {
      error.data.then(data => {
        console.error('Fetch error:', error);
        const queryParams = new URLSearchParams({
          statusCode: data.statusCode,
          message: data.message,
          status: data.status,
          homeLink: data.homeLink,
        });
        console.log(queryParams.toString())
        window.location.href = `/error?${queryParams.toString()}`;
      });
    }
  }


  function clearError(id){
    document.getElementById(id).innerHTML=''
}
