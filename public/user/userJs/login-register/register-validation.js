setTimeout(()=>{
    document.getElementById('alertMessage').innerHTML=''
},3000)

function validateForm(){
    let isValid=true
    const fname=document.getElementById('fname').value.trim()
    const lname=document.getElementById('lname').value.trim()
    const email=document.getElementById('email').value.trim()
    const password=document.getElementById('password').value.trim()
    const rePassword=document.getElementById('rePassword').value.trim()

    const fnameError = document.getElementById('fnameError');
    const lnameError = document.getElementById('lnameError');
    const rePasswordError = document.getElementById('rePasswordError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const emailregEx=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const fnameRegEx=/^[A-Za-z']{3,}$/
    const nameregEx=/^[A-Za-z']+$/

    if(!(fname && lname && email && password && rePassword)){
        if(!fname) fnameError.innerHTML='*first name is required.'
        if(!lname) lnameError.innerHTML='*last name is required.';
        if(!email) emailError.innerHTML='*email is required.'
        if(!password) passwordError.innerHTML='*password is required.'
        if(!rePassword) rePasswordError.innerHTML='*re-enter password is required.'

        isValid=false
    }else if(!emailregEx.test(email)){
        if(!email) emailError.innerHTML='*invalid email format'
        isValid=false
    }else if(!fnameRegEx.test(fname)){
        fnameError.innerHTML='*invalid first name'
        isValid=false
    }else if(!nameregEx.test(lname)){
        lnameError.innerHTML='*invalid last name';
        isValid=false
    }else if(password!=rePassword){
        rePasswordError.innerHTML='*you entered two diffrent password'
        isValid=false
        
    }else if(password.length<6){
        passwordError.innerHTML='*password should have a minimum length of 6 characters';
        isValid=false

    }
        
    return isValid
}
function clearError(id){
    document.getElementById(id).innerHTML=''
}