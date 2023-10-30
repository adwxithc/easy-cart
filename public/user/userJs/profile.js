let originalValues={}
function editProfile(){
    const userInfos=document.querySelectorAll('.userInfo')
    for(let info of userInfos){
        originalValues[info.id]=info.value
        info.style.cursor='auto'
        info.removeAttribute('disabled')
    }
    document.getElementById('save').style.display='inline-block';
    const edit=document.getElementById('editProfile')
    edit.innerHTML='Cancel'
    edit.id='cancelEdit'

}
function cancelEdit(){
    const userInfos=document.querySelectorAll('.userInfo')
    for(let info of userInfos){
        info.value=originalValues[info.id]
        info.style.cursor='not-allowed'
        info.setAttribute('disabled','disabled')
    }
    document.getElementById('save').style.display='none';
    const cancel=document.getElementById('cancelEdit')
    cancel.innerHTML='Edit'
    cancel.id='editProfile'
}

function updateUserInfo(data){
    fetch('/updateUserInfo',{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
    })
    .then(response=>{
        if(response.ok) return response.json()
        throw new Error('unable to connect to server')
    })
    .then(data=>{
        alert(data)
    })
    .catch((error)=>{
        console.log(error)
        alert('something went wrong')
    })


}

function validateEditUserInfo(){

    const fname=document.getElementById('fname')
    const lname=document.getElementById('lname')
    const email=document.getElementById('email')
    const mobile=document.getElementById('mobile')

    const emailRegx=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const mobileRegx=/^\d{10}$/;
    
    const fnameError=document.getElementById('fnameError')
    const lnameError=document.getElementById('lnameError')
    const emailError=document.getElementById('emailError')
    const mobileError=document.getElementById('mobileError')

    if(fname.value.trim()==''){
        fnameError.innerHTML="First Name can't be null";
        clearAfterThreeSec(fnameError)
    }else if(lname.value.trim()==''){
        lnameError.innerHTML="Last Name can't be null";
        clearAfterThreeSec(lnameError)
    }else if(email.value.trim()==''){
        emailError.innerHTML="Email Can't be null";
        clearAfterThreeSec(emailError)
    }else if(!emailRegx.test(email.value.trim())){
        emailError.innerHTML="Invalid email format";
        clearAfterThreeSec(emailError)
    }else if(!mobileRegx.test(mobile.value.trim()) && mobile.value.trim()!=''){
        mobileError.innerHTML="Invalid mobile number format"
        clearAfterThreeSec(mobileError)
    }else{
        updateUserInfo({
            fname:fname.value,
            lname:lname.value,
            email:email.value,
            mobile:mobile.value
        })
    }

}
function clearAfterThreeSec(element){
    setTimeout(()=>{
        element.innerHTML=''
    },3000)
}