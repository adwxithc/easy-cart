

function addCoupone(){
    
    const couponeData=new FormData(document.getElementById('addCouponeForm'))
    if(validateCoupone(couponeData)){
       fetch('/admin/addCoupone',{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(couponeData).toString(),

       })
       .then(response=>{
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };
       })
       .then(data=>{
        if(data.created){
            document.getElementById('addCouponeForm').reset()
        
            Swal.fire({
            icon: "success",
            text: "New Coupone created",
            showConfirmButton: false,
            timer: 1500
            });
        }else{
                    
            Swal.fire({
                icon: "error",
                text: data.message,
                showConfirmButton: false,
                timer: 1500
                });
        }
       })
       .catch(handleError)
    }
}





function validateCoupone(data){

    const couponeRegex = /^[a-zA-Z0-9_-]{6,}$/;
        const code=data.get('couponeCode')
        const minAmt=data.get('minPurchaseAmount')
        const maxAmt=data.get('maxPurchaseAmount')
        const discount=data.get('couponeDiscount')
        const startDate=data.get('startDate')
        const expireDate=data.get('expireDate')
        const quantity=data.get('quantity')

        if(!code || !minAmt || !maxAmt || !discount || !startDate || !expireDate || !quantity){
            if(!code ) document.getElementById('CouponeCodeError').innerHTML="Coupone code can't be null"
            if(!minAmt ) document.getElementById('minPurchaseAmountError').innerHTML="Coupone minimum purchase amount can't be null"
            if(!maxAmt ) document.getElementById('maxPurchaseAmountError').innerHTML="Coupone maximum purchase amount can't be null"
            if(!discount ) document.getElementById('couponeDiscountError').innerHTML="Coupone discount amount can't be null"
            if(!startDate ) document.getElementById('startDateError').innerHTML="Coupone start date can't be null"
            if(!expireDate ) document.getElementById('expireDateError').innerHTML="Coupone expire date can't be null"
            if(!quantity ) document.getElementById('quantityError').innerHTML="Coupone quantity can't be null"

            return false
        }
        if(Number(minAmt) > Number(maxAmt)){
            document.getElementById('minPurchaseAmountError').innerHTML='minimum amount should be less than maximum amount'
            document.getElementById('maxPurchaseAmountError').innerHTML='maximum amount should be greater than minimum amount'
            return false
        }
        if(Number(discount)<=0){
            document.getElementById('couponeDiscountError').innerHTML='discount persentage should be  greater than zero'
            return false
        }else if(Number(discount)>100){
            document.getElementById('couponeDiscountError').innerHTML='discount persentage should be  less than hundred'
            return false
        }
        if(startDate>=expireDate){
            document.getElementById('startDateError').innerHTML='Start date must be before the expire date'
            document.getElementById('expireDateError').innerHTML='Expire date must be after the start date'
            return false
        }
        if(code.trim().length<6){
            document.getElementById('CouponeCodeError').innerHTML='coupone code must have minimum 6 character'
            return false
        }
        if(!couponeRegex.test(code)){
            document.getElementById('CouponeCodeError').innerHTML='Invalid coupone code'
            return false
        }
        if(isNaN(quantity)){
            if(isNaN(quantity) ) document.getElementById('quantityError').innerHTML="Coupone quantity should be a number"
            return false
            
        }
        if(quantity<0){
            if(isNaN(quantity) ) document.getElementById('quantityError').innerHTML="Coupone quantity should be greater than zero"
            return false
        }
        return true
}


function updateCoupone(){
    const couponeFormData=new FormData(document.getElementById('editCouponeForm'))
    if(validateCoupone(couponeFormData)){
        
        fetch('/admin/updateCoupone',{
            method:'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams(couponeFormData).toString(),
    
           })
           .then(response=>{
            if(response.ok) return response.json()
            throw { status: response.status, data: response.json() };
           })
           .then(data=>{
            if(data.updated){

            
                Swal.fire({
                icon: "success",
                text: data.message,
                showConfirmButton: false,
                timer: 1500
                })
                .then(()=>{
                    loadPage('/admin/viewCoupones',[])
                });
            }else{
                        
                Swal.fire({
                    icon: "error",
                    text: data.message,
                    showConfirmButton: false,
                    timer: 1500
                    });
            }
           })
           .catch(handleError)

    }
}

function listUnlistCoupone(couponeId){
    fetch(`/admin/listUnlistCoupone`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({couponeId:couponeId})
    })
    .then(response=>{
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };
    })
    .then(data=>{
        if(data.updated){
            Swal.fire({
            icon: "success",
            text: data.message,
            showConfirmButton: false,
            timer: 1500
            });
            updateCouponStatus(couponeId,data.status)

        }else{
                    
            Swal.fire({
                icon: "error",
                text: data.message,
                showConfirmButton: false,
                timer: 1500
                });
        }
    })
    .catch(handleError)
}

function updateCouponStatus(couponId, status) {
    const statusElement = document.getElementById('status' + couponId);
    const changeElement = document.getElementById('change' + couponId);

    statusElement.classList.remove(status ? 'text-danger' : 'text-success');
    statusElement.classList.add(status ? 'text-success' : 'text-danger');
    statusElement.textContent = status ? 'listed' : 'unlisted';
    changeElement.textContent = status ? 'unlist' : 'list';
}