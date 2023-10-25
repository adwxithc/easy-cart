const addToCart=document.getElementById('addToCart').addEventListener('click',()=>{
    const productId=document.getElementById('ProductId').value
    const quantity=document.getElementById('qty').value

    const addToCartData={
        productId:productId,
        quantity:quantity
    }

   
    fetch('/api/add-to-cart',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(addToCartData)
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
        throw new Error('unable to connect to server')
    })
    .then(data=>{
        if (typeof data === 'object') {

                alert('cart added')


        }else{
            alert('logi')
            window.location.href='/login'

        }


    })
    .catch((er)=>{
        console.log(er.message)
        // window.location.href='/'

    })
})