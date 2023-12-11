function validateForm(){
    let isValid=true;
    const newPassword=document.getElementById('password').value.trim()
    const rePassword=document.getElementById('rePassword').value.trim()
    if(!newPassword || !rePassword){
        if(!newPassword) document.getElementById('passwordError').innerHTML='*please provide a password'
        if(!rePassword) document.getElementById('rePasswordError').innerHTML='*please confirm the password'
        isValid=false
    }else if(rePassword !== newPassword){
       document.getElementById('rePasswordError').innerHTML='*you entered two diffrent password '
        isValid=false

    }else if(newPassword.length<6){
        document.getElementById('passwordError').innerHTML='*password should have a minimum of 6 characters'
        isValid=false

    }

    return isValid
}

function clearError(id){
    document.getElementById(id).innerHTML=''
}