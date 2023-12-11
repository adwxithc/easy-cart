window.onload=function(){
    setTimeout(()=>{
        document.getElementById('alertMessage').innerHTML=''
    },3000)
}


    function validateForm(){
        let isValid=true
        const email=document.getElementById('email').value?.trim()
        const emailRegx=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!email){
            document.getElementById('emailError').innerHTML='*please provide your email'
            isValid=false
        }else if(!emailRegx.test(email)){
            document.getElementById('emailError').innerHTML='*please provide a valid email'
            isValid=false
        }
        return isValid
    }

    function clearError(id){
        document.getElementById(id).innerHTML=''
    }