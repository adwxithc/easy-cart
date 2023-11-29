if(document.getElementById('addToCart')){
const addToCart=document.getElementById('addToCart').addEventListener('click',()=>{
    const productId=document.getElementById('ProductId').value
    const quantity=document.getElementById('productDetailsquantity').value
    // const price=document.getElementById('price').value
    addProductToCart(productId,quantity)

    // const addToCartData={
    //     productId:productId,
    //     quantity:quantity,
    //     price:price
    // }

   
    // fetch('/api/add-to-cart',{
    //     method:'POST',
    //     headers:{'Content-Type':'application/json'},
    //     body:JSON.stringify(addToCartData)
    // })
    // .then(response=>{
        
    //     if(response.ok){
    //         const contentType = response.headers.get("content-type");

    //         if (contentType && contentType.includes("application/json")) {
    //           return response.json(); // Parse JSON response
    //         } else {
    //           return response.text(); // Assume HTML content
    //         }
    //     }
    //     throw new Error('unable to connect to server')
    // })
    // .then(data=>{
    //     if (typeof data === 'object') {

    //         showModal(data.message)
    //         setTimeout(()=>{
    //             closeModal()
    //         },1100)

    //         if(data.added)
    //         {
    //             const cartCount=document.querySelector('.cBadge')
           
    //             cartCount.style.display='flex'
    //             cartCount.innerHTML=data.count

    //              changeToGoToCart()
    //         }
            
            


    //     }else{
    //         showModal("Please login to add the product to cart")
    //         setTimeout(()=>{
    //             closeModal()
    //             window.location.href='/login'
    //         },1200)
            

    //     }


    // })
    // .catch((er)=>{
    //     console.log(er.message)
    //     // window.location.href='/'

    // })
})

function addProductToCart(productId,quantity){
    const addToCartData={
        productId:productId,
        quantity:quantity,
  
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

            showModal(data.message)
            setTimeout(()=>{
                closeModal()
            },1100)

            if(data.added)
            {
                const cartCount=document.querySelector('.cBadge')
           
                cartCount.style.display='flex'
                cartCount.innerHTML=data.count

                 changeToGoToCart()
            }

        }else{
            showModal("Please login to add the product to cart")
            setTimeout(()=>{
                closeModal()
                window.location.href='/login'
            },1200)

        }

    })
    .catch((er)=>{
        console.log(er.message)
        // window.location.href='/'

    })
}


function changeToGoToCart() {
    const addToCartButton = document.getElementById('addToCart');
    addToCartButton.innerHTML = 'Go to Cart';
    addToCartButton.id = 'goToCart';
    addToCartButton.href = '/api/goToCart';
}
}


    function buyNow(){
        const quantity=document.getElementById('productDetailsquantity').value
        const productId=document.getElementById('ProductId').value

        window.location.href=`/api/checkout?productId=${productId}&quantity=${quantity}`
    }