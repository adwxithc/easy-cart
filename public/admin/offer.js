// let totalpages
// let currentPage


function addOffer(){
    const offerFormData=new FormData(document.getElementById('addOfferForm'))
    if(validateOffer(offerFormData)){
       fetch('/admin/addOffer',{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body:new URLSearchParams(offerFormData).toString(),
       })
       .then(response=>{
        if(response.ok) return response.json()
        throw new Error('server communication error')
       })
       .then(data=>{
        if(data.created){
            document.getElementById('addOfferForm').reset()
        
            Swal.fire({
            icon: "success",
            text: "New Offer created",
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
    }
}

function updateOffer(){
    const offerFormData=new FormData(document.getElementById('editOfferForm'))
    if(validateOffer(offerFormData)){
        
        fetch('/admin/updateOffer',{
            method:'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams(offerFormData).toString(),
    
           })
           .then(response=>{
            if(response.ok) return response.json()
            throw new Error('unable to connect to the server')
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
                    loadPage('/admin/viewOffers',[])
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
           .catch((error)=>{
            console.error(error)
            Swal.fire({
                icon: "error",
                text: 'something went wrong',
                showConfirmButton: false,
                timer: 1500
                });
            
           })

    }
}

function validateOffer(data){

        const name=data.get('name')
        const discount=data.get('discountPercentage')
        const startDate=data.get('startDate')
        const expireDate=data.get('expireDate')

        if(!name ||!discount || !startDate || !expireDate){
            if(!name) document.getElementById('offerNameError').innerHTML="Offer name can't be null"
            if(!discount ) document.getElementById('discountPercentageError').innerHTML="Offfer discount  can't be null"
            if(!startDate ) document.getElementById('startDateError').innerHTML="Coupone start date can't be null"
            if(!expireDate ) document.getElementById('expireDateError').innerHTML="Coupone expire date can't be null"
            return false
        }

        if(Number(discount)<=0){
            document.getElementById('discountPercentageError').innerHTML='discount persentage should be  greater than zero'
            return false
        }else if(Number(discount)>100){
            document.getElementById('discountPercentageError').innerHTML='discount persentage should be  less than hundred'
            return false
        }
       
        if(startDate>=expireDate){
            document.getElementById('startDateError').innerHTML='Start date must be before the expire date'
            document.getElementById('expireDateError').innerHTML='Expire date must be after the start date'
            return false
        }

        return true
}

function listUnlistOffer(offerId){
    fetch(`/admin/listUnlistOffer`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({offerId:offerId})
    })
    .then(response=>{
        if(response.ok) return response.json()
        throw new Error('server communication error')
    })
    .then(data=>{
        if(data.updated){
            Swal.fire({
            icon: "success",
            text: data.message,
            showConfirmButton: false,
            timer: 1500
            });
            updateOfferStatus(offerId,data.status)

        }else{
                    
            Swal.fire({
                icon: "error",
                text: data.message,
                showConfirmButton: false,
                timer: 1500
                });
        }
    })
    .catch((error)=>{
        console.error(error)
        Swal.fire({
            icon: "error",
            text: 'something went wrong',
            showConfirmButton: false,
            timer: 1500
            });
    })
}

function updateOfferStatus(offerId, status) {
    const statusElement = document.getElementById('status' + offerId);
    const changeElement = document.getElementById('change' + offerId);

    statusElement.classList.remove(status ? 'text-danger' : 'text-success');
    statusElement.classList.add(status ? 'text-success' : 'text-danger');
    statusElement.textContent = status ? 'listed' : 'unlisted';
    changeElement.textContent = status ? 'unlist' : 'list';
}










function updateOfferPagination(){
    let totalpages=document.getElementById("totp").value
    let currentPage = document.getElementById("cur").value

    const prev=document.getElementById('prevOffers')  
    const next=document.getElementById('nextOffers')
    const currentBtn=document.getElementById('currentOffers')
      
  prev.disabled= currentPage==1 ;
  next.disabled= currentPage == totalpages;
  currentBtn.textContent=currentPage;
}

function prevOffers(){

    let currentPage = document.getElementById("cur").value
  if (currentPage > 1) {
              
              
      currentPage--;
      document.getElementById("cur").value=currentPage
      updateOfferPagination();
      loadPage(`/admin/viewOffers?page=${currentPage}`,[updateOfferPagination]);
  }
}

function nextOffers(){
    let totalpages=document.getElementById("totp").value
    let currentPage = document.getElementById("cur").value
  if ( Number(currentPage) < Number(totalpages)) {
    
      currentPage++;
      document.getElementById("cur").value=currentPage
      updateOfferPagination();
 
      loadPage(`/admin/viewOffers?page=${currentPage}`,[updateOfferPagination]);
  }
}



function applayOfferToProduct(offerId,productId){

        fetch(`/admin/applyOfferToProduct`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({offerId:offerId,productId:productId})
        })
        .then(response=>{
            if(response.ok)  return response.json()
            throw new Error('server communication error')
        })
        .then(data=>{
            if(data.applied){
                Swal.fire({
                icon: "success",
                text: data.message,
                showConfirmButton: false,
                timer: 1500
                });

                setPageAfterApplayOffer(productId,data.offer)
    
            }else{
                        
                Swal.fire({
                    icon: "error",
                    text: data.message,
                    showConfirmButton: false,
                    timer: 1500
                    });
            }
        })
        .catch((error)=>{
            console.error(error)
            Swal.fire({
                icon: "error",
                text: 'something went wrong',
                showConfirmButton: false,
                timer: 1500
                });
        })
}

function applayOfferToCategory(offerId,categoryId){
    fetch(`/admin/applyOfferToCategory`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({offerId:offerId,categoryId:categoryId})
    })
    .then(response=>{
        if(response.ok)  return response.json()
        throw new Error('server communication error')
    })
    .then(data=>{
        if(data.applied){
            Swal.fire({
            icon: "success",
            text: data.message,
            showConfirmButton: false,
            timer: 1500
            });

            setCategoryPageAfterSettingOffer(categoryId,data.offer)

        }else{
                    
            Swal.fire({
                icon: "error",
                text: data.message,
                showConfirmButton: false,
                timer: 1500
                });
        }
    })
    .catch((error)=>{
        console.error(error)
        Swal.fire({
            icon: "error",
            text: 'something went wrong',
            showConfirmButton: false,
            timer: 1500
            });
    })
}

function setPageAfterApplayOffer(productId,data){
    const modal=document.getElementById('viewModal')
    modal.removeAttribute('productId')
    modal.style.display='none'
    document.getElementById('offer'+productId).innerHTML=`${data.name}(${data.discountPercentage}%)`

    option=document.getElementById(`manageOffer${productId}`)
    option.classList.remove('applyOffer')
    option.classList.add('removeOffer')
    option.innerHTML='remove offer'
}

function setCategoryPageAfterSettingOffer(categoryId,data){
    const modal=document.getElementById('viewModal')
    modal.removeAttribute('categoryId')
    modal.style.display='none'
    document.getElementById('offer'+categoryId).innerHTML=`${data.name}(${data.discountPercentage}%)`

    option=document.getElementById(`manageOffer${categoryId}`)
    option.classList.remove('applyOffer')
    option.classList.add('removeOffer')
    option.innerHTML='remove offer'
}

function getOffers(id,type){
    fetch('/admin/getOffers')
    .then(response=>{
        if(response.ok) return response.text()
        throw new Error('server communication error')
    })
    .then(html=>{
        const modal=document.getElementById('viewModal')

        if(type=='productId'){

        modal.removeAttribute('productId')
        modal.setAttribute('productId',id)
        modal.style.display='block'
        }else{
            modal.removeAttribute('categoryId')
            modal.setAttribute('categoryId',id)
            modal.style.display='block'
        }
        document.getElementById('viewModal-content').innerHTML=html
    })
    .catch((error)=>{
        console.error(error)
        Swal.fire({
            icon: "error",
            text: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500
            });
    })
}