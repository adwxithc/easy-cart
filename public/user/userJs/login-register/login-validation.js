setTimeout(()=>{
    document.getElementById('alertMessage').innerHTML=''
},3000)
    


function validateLogin() {
   

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid=true
 
    if(!(email&&password)){
        if(email==''){
            document.getElementById('emailError').innerHTML='*email is required'
        }
        if(password==''){
            document.getElementById('passwordError').innerHTML='*password is required'

        }
        isValid=false
    }else if(!emailRegex.test(email)){
        document.getElementById('emailError').innerHTML='*enter valid email'
        isValid=false

    }else if(password.length<4){
        document.getElementById('passwordError').innerHTML='*password should contain more than 4 characters'
        isValid=false
    }
console.log('password',password,'email',email,isValid)

    return isValid
}

function clearError(id){
    document.getElementById(id).innerHTML=''
}
