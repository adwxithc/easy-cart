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
       
        throw { status: response.status, data: response.json() };
    
    })
    .then(data=>{
        
        showModal(data.message)

        document.getElementById('save').style.display='none';
        const cancel=document.getElementById('cancelEdit')
        cancel.innerHTML='Edit'
        cancel.id='editProfile'
        const userInfos=document.querySelectorAll('.userInfo')
        for(let info of userInfos){
            
            info.style.cursor='not-allowed'
            info.setAttribute('disabled','disabled')
        }
    })
    .catch(handleError)


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

function getManageAddress(){
   
    fetch('/manageAddress')
    .then(response=>{
        if(response.ok) return response.text()
        throw { status: response.status, data: response.json() };

    })
    .then(data=>{
        
        document.getElementById('profileSettingArea').innerHTML=data
        setSelected('manageAddress')
        
    })
    .catch(handleError)
}

function removeErrorMessage(){
    
    document.getElementById('newAddress').addEventListener('click',(e)=>{
       
        if(e.target.id=='fname') document.getElementById('fnameError').innerHTML='';
        else if(e.target.id=='lname') document.getElementById('lnameError').innerHTML='';
        else if(e.target.id=='pin') document.getElementById('pinError').innerHTML='';
        else if(e.target.id=='locality') document.getElementById('localityError').innerHTML='';
        else if(e.target.id=='area') document.getElementById('areaError').innerHTML='';
        else if(e.target.id=='CDT') document.getElementById('CDTError').innerHTML='';
        else if(e.target.id=='state') document.getElementById('stateError').innerHTML='';
        else if(e.target.id=='altPhone') document.getElementById('altPhoneError').innerHTML='';
        
    })
}



function validateAddress(cb){
    removeErrorMessage()
    const pinRegx=/^\d{6}$/;
    const phoneRegx=/^[6789]\d{9}$/;
    const nameRegx=/^[A-Za-z\s'-]+$/;


    const fname=document.getElementById('fname')
    const mobile=document.getElementById('mobile')
    const pincode=document.getElementById('pin')
    const locality=document.getElementById('locality')
    const area=document.getElementById('area')
    const CDT=document.getElementById('CDT')
    const state=document.getElementById('state')
   const landmark=document.getElementById('landmark')
    const altPhone=document.getElementById('altPhone')
    

    const fnameError=document.getElementById('fnameError');
    const mobileError=document.getElementById('mobileError');
    const pinError=document.getElementById('pinError');
    const localityError=document.getElementById('localityError');
    const areaError=document.getElementById('areaError');
    const CDTError=document.getElementById('CDTError');
    const  stateError=document.getElementById('stateError');
   
    const  altPhoneError=document.getElementById('altPhoneError');

    

    if(fname.value.trim()==''){

        fnameError.innerHTML="first name can't be null"

    }else if(!nameRegx.test(fname.value.trim())){

        fnameError.innerHTML="Invalid name format"

    }else if(mobile.value.trim()==''){

        mobileError.innerHTML="Mobile number can't be null"

    }else if(!phoneRegx.test(mobile.value.trim())){

        mobileError.innerHTML="Invalid mobile number"

    }else if(pincode.value.trim()==''){

        pinError.innerHTML="pincode can't be null"

    }else if(!pinRegx.test(pincode.value.trim())){

        pinError.innerHTML="Invalid pincode"

    }else if(locality.value.trim()==''){

        localityError.innerHTML="locality can't be null"

    }else if(area.value.trim()==''){

        areaError.innerHTML="Area/Street can't be null"

    }else if(CDT.value.trim()==''){

        CDTError.innerHTML="City/District/Town can't be null"

    }else if(state.value.trim()=='Select State'||state.value.trim()==''){
        

        stateError.innerHTML="state can't be null"

    }else if(altPhone.value.trim()!='' && !phoneRegx.test(altPhone.value.trim())){

        altPhoneError.innerHTML='Invalid phone number format'

    }else{
        cb({
            fname:fname.value,
            mobile:mobile.value,
            pincode:pincode.value,
            locality:locality.value,
            area:area.value,
            cdt:CDT.value,
            state:state.value,
            altPhone:altPhone.value,
            landmark:landmark.value
        })
    }

}



function addNewAddress(newAddress){
    fetch('/addNewAddress',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(newAddress)

    })
    .then(response=>{
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };

    })
    .then(data=>{
        if(data.added){
            showModal(data.message)
            document.getElementById('addressForm').reset()
            unsetAddAddress()
            //checking from where the address is adding(at checkout or user profile)

            if(document.getElementById('addAddress').classList.contains('atCheckout')){
                const newAddressOption = createAddressOption(data.newAddress);//createAddressOption->this function will be at checkout.js files
                appendAddressToList(newAddressOption);

            }else{
                const newAddressElement = createAddressElement(data.newAddress);
                appendAddressToList(newAddressElement);
            }

        }

    })
    .catch(handleError)
}

function setAddAddress(){
    document.getElementById('addressUpdateContainer').style.display='block'
    document.getElementById('addAddressContainer').style.display='none'
}
function unsetAddAddress(){
    document.getElementById('addressUpdateContainer').style.display='none'
    document.getElementById('addAddressContainer').style.display='block'
}

function createAddressElement(addressData) {
 
    const addressElement = document.createElement('div');
    addressElement.classList.add('address', 'p-3');
    addressElement.id = addressData._id;
    const innerHTML=` 
    <div>
        <div class="d-flex head"><h6 class="p-1 mr-1">${addressData.name}</h6><h6 class="p-1">${addressData.mobile}</h6></div>
    </div>
    <p class="p-1 infos">
        ${ addressData.area}, ${ addressData.locality}, ${addressData.city}, ${addressData.state}-<span class="text-dark ">${addressData.pincode}</span> 
    </p>
    <div class="d-flex justify-content-end"><a href='/editAddress?id=${addressData._id}' class="px-2 opt-link editAddress" >Edit</a><a href="#" class="px-2 opt-link deletAddress" id="${addressData._id}">Remove</a></div>`
  
    addressElement.innerHTML=innerHTML
    return addressElement;
}




function appendAddressToList(addressElement) {
    // Append the addressElement to the list of addresses on the webpage.
    const addressList = document.querySelector('#addressList');
    addressList.insertBefore(addressElement, addressList.firstChild);
}



function removeAddress(productId){

        const confirmModal=document.getElementById('confirmRemoveAddress')
        confirmModal.style.display = "block";
        confirmModal.setAttribute('product',productId)

            // Close the modal when the close button is clicked
    document.getElementById('closedeleteAddressConfirmation').onclick = function() {
        document.getElementById('confirmRemoveAddress').style.display = "none";
    }

    // Close the modal when the user confirms
    document.getElementById('confirmAddressRemoval').onclick = function() {
        const confirmModal=document.getElementById('confirmRemoveAddress')
        confirmModal.style.display = "none";
        const id=confirmModal.getAttribute('product')
        deletAddress(id)
    
        // You can add your confirmation logic here
    }

}


function deletAddress(id){
    fetch('/deleteAddress',{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:id})
    })
    .then(response=>{
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };

    })
    .then(data=>{
        if(data.deleted){
            showModal(data.message)
            document.getElementById(id).style.display='none'
        }else{
            showModal(data.modal)
        }
        
    })
    .catch(handleError)
}

function validateUpdatedAddress(){
   

    removeErrorMessage()
    const pinRegx=/^\d{6}$/;
    const phoneRegx=/^[6789]\d{9}$/;
    const nameRegx=/^[A-Za-z\s'-]+$/;


    const fname=document.getElementById('fname')
    const mobile=document.getElementById('mobile')
    const pincode=document.getElementById('pin')
    const locality=document.getElementById('locality')
    const area=document.getElementById('area')
    const CDT=document.getElementById('CDT')
    const state=document.getElementById('state')
  
    const altPhone=document.getElementById('altPhone')
   

    const fnameError=document.getElementById('fnameError');
    const mobileError=document.getElementById('mobileError');
    const pinError=document.getElementById('pinError');
    const localityError=document.getElementById('localityError');
    const areaError=document.getElementById('areaError');
    const CDTError=document.getElementById('CDTError');
    const  stateError=document.getElementById('stateError');
   
    const  altPhoneError=document.getElementById('altPhoneError');

    

    if(fname.value.trim()==''){

        fnameError.innerHTML="first name can't be null"
        return false

    }else if(!nameRegx.test(fname.value.trim())){

        fnameError.innerHTML="Invalid name format"
        return false

    }else if(mobile.value.trim()==''){

        mobileError.innerHTML="Mobile number can't be null"
        return false

    }else if(!phoneRegx.test(mobile.value.trim())){

        mobileError.innerHTML="Invalid mobile number"
        return false

    }else if(pincode.value.trim()==''){

        pinError.innerHTML="pincode can't be null"
        return false

    }else if(!pinRegx.test(pincode.value.trim())){

        pinError.innerHTML="Invalid pincode"
        return false

    }else if(locality.value.trim()==''){

        localityError.innerHTML="locality can't be null"
        return false

    }else if(area.value.trim()==''){

        areaError.innerHTML="Area/Street can't be null"
        return false

    }else if(CDT.value.trim()==''){

        CDTError.innerHTML="City/District/Town can't be null"
        return false

    }else if(state.value.trim()=='Select State'||state.value.trim()==''){
        

        stateError.innerHTML="state can't be null"
        return false

    }else if(altPhone.value.trim()!='' && !phoneRegx.test(altPhone.value.trim())){

        altPhoneError.innerHTML='Invalid phone number format'
        return false

    }else{return true}

}

function updateAddress(address){
    address['addressId']=document.getElementById('addressId').value
    
    fetch('/updateAddress',{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(address)
    })
    .then(response=>{
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };

    })
    .then(data=>{
        if(data.success){
            showModal(data.message)
        }
    })
    .catch(handleError)
}


function changePassword(){
   
  
    fetch('/changePassword')
    .then(response=>{

        if(response.ok) return response.text()
        throw { status: response.status, data: response.json() };
    })
    .then(html=>{
        document.getElementById('profileSettingArea').innerHTML=html
        setSelected('changePassword')

    })
    .catch(handleError)
}

function removePasswordErrorMessage(){
    document.getElementById('changePasswordDiv').addEventListener('click',(e)=>{
        
        if(e.target.id=='cPassword') document.getElementById('cPasswordError').innerHTML='';
        else if(e.target.id=='nPassword') document.getElementById('nPasswordError').innerHTML='';
        else if(e.target.id=='rePassword') document.getElementById('rePasswordError').innerHTML='';
    },true)
}

function validateChangePassword(data){
  
    removePasswordErrorMessage()

    const cPassword=data.get('cPassword')
    const nPassword=data.get('nPassword')
    const rePassword=data.get('rePassword')

   

    const cPasswordError=document.getElementById('cPasswordError')
    const nPasswordError=document.getElementById('nPasswordError')
    const rePasswordError=document.getElementById('rePasswordError')

    if(cPassword.trim()==''){
        cPasswordError.innerHTML="your current password can't be null"
        return false
    }else if(cPassword.trim().length<6){
        cPasswordError.innerHTML="your current password should be in more than 6 character"
        return false
    }else if(nPassword.trim()==''){
        nPasswordError.innerHTML="your new password can't be null"
        return false
    }else if(nPassword.trim().length<6){
        nPasswordError.innerHTML="your new password should be in more than 6 character"
        return false
    }else if(rePassword.trim()==''){
        rePasswordError.innerHTML="your re-entered password can't be null"
        return false
    }else if(rePassword.trim().length<6){
        rePasswordError.innerHTML="your re-entered password should be in more than 6 character"
        return false
    }else if(!(rePassword.trim()==nPassword.trim())){
        nPasswordError.innerHTML="your  entered two new diffrent password"
        rePasswordError.innerHTML="your  entered two new diffrent password"
        return false
    }else{
       
        return true
    }

}

function updatePassword(){
   
    const changePasswordForm=document.getElementById('changePasswordForm')
    const formData=new FormData(changePasswordForm)
    

    const valid=validateChangePassword(formData)
    if(valid){

        fetch('/updatePassword',{
            method:'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams(formData).toString(),
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
           
            throw { status: response.status, data: response.json() };

        })
        .then(data=>{
            if (typeof data === 'object'){
            showModal(data.message)
            if(data.changed){
                changePasswordForm.reset()
            }
        }else{
            window.location.href='/login'
        }
        })

        .catch(handleError)
    }
}

function setSelected(elemId){
    const selectedElem=document.querySelector('.selected')
    selectedElem.classList.remove('selected')
    document.getElementById(elemId).classList.add('selected')
}