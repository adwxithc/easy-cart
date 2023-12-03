function showWallet(){
   
    fetch('/api/getWallet')
    .then(response=>{
        if(response.ok) return response.text()
        throw { status: response.status, data: response.json() };

    })
    .then(html=>{
        document.getElementById('profileSettingArea').innerHTML=html
        document.querySelector('.selected').classList.remove('selected')
        document.getElementById('addToWallet').classList.add('selected')
    })
    .catch(handleError)
}

function addMoneyToWallet(){
    const amount=document.getElementById('amount').value
    if(!amount||amount<1 || isNaN(amount)){
        showModal('Invalid amount')
    }else{
        
        fetch('/api/addAmountToWallet',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({amount:amount})
        })
        .then(response=>{
            if(response.ok) return response.json()
            throw { status: response.status, data: response.json() };
        })
        .then(data=>{
            
            if(data.order){
                razorpayAddAmount(data.order,data.userInfo)
            }
            
        })
        .catch(handleError)
    }
}
function razorpayAddAmount(order,userInfo){

    var options = {
      "key": "rzp_test_s3jjV861Udy8by", // Enter the Key ID generated from the Dashboard
      "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "Easy Cart", //your business name
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler":function(response){
        
        verifyAmount(response,order)
      },
      "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
          "name": userInfo.name, //your customer's name
          "email": userInfo.email,
          "contact": userInfo.mobile //Provide the customer's phone number for better conversion rates 
      },
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#292929"
      }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
  
}
function verifyAmount(payment,order){
    fetch('/api/verifyAddToWallet',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({payment:payment,order:order})
      })
      .then(response=>{
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };
      })
      .then(data=>{
        document.getElementById('balance').innerHTML='&#8377;'+data.balance
        addNewTransaction(data.transaction)
          if(data.added){
            
            Swal.fire({
                icon: "success",
                text: data.message,
                showConfirmButton: false,
                timer: 1500
              });
          }else{
            showModal('payment failed')
          }
      })
      .catch(handleError)
}

function addNewTransaction(transaction){

    const transactionDiv=document.createElement('div')
    transactionDiv.classList='project transaction my-3'
    transactionDiv.innerHTML=`
    <div><span class="bold">TRANSACTION ID  :</span><span class="mr-auto">${transaction.transaction_id}</span></div>
    <div><span class="bold">TYPE  :</span><span class="mr-auto">${transaction.type}</span></div>
    <div><span class="bold">AMOUNT  :</span><span class="mr-auto">${transaction.amount}</span></div>
    <div><span class="bold">TIME  :</span><span class="mr-auto">${ new Date(transaction.timestamp).toLocaleString()}</span></div>
    <div><span class="bold">DESCRIPTION  :</span ><span class="mr-auto">${transaction.description}</span></div>
    `
    const transactionList=document.getElementById('transactionList')
    transactionList.insertBefore(transactionDiv,transactionList.firstChild)
    document.getElementById('amount').value=''

}