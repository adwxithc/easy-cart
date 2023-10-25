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
    // const phone=document.getElementById('phone').value;
    // const prof=document.getElementById('prof').value;
    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rpassword = document.getElementById('rePassword').value;

    

    const rerrorPassword = document.getElementById('rePasswordError');
    const errorUsername = document.getElementById('emailError');
    const errorPassword = document.getElementById('passwordError');
    const errorFname = document.getElementById('fnameError');
    const errorSname = document.getElementById('lnameError');
    // const errorPhone = document.getElementById('phoneError');
    // const errorProf = document.getElementById('profError');
    
  
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
    // document.getElementById('phone').addEventListener('focusin',()=>{
    // errorPhone.innerHTML = '';
    // })
    // document.getElementById('prof').addEventListener('focusin',()=>{
    // errorProf.innerHTML = '';
    // })
   
  
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
//phone number
// if(!phoneExpr.test(phone)){
//     errorPhone.innerHTML="*invalid Phone nummber"
//     isValid=false;
// }
//picture
// if (prof.trim() === '') {
//     errorProf.innerHTML = '*Profile picture is required.';
//     isValid = false;
// } 

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
    const modal = document.getElementById('modal');
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
    const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.remove('show'); // Remove the 'show' class
    modal.style.display = 'none'; // Hide the modal
}

