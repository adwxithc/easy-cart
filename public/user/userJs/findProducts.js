if(document.getElementById('totalProductPages')){
let totalProductPages=document.getElementById('totalProductPages').value;
let page=1;


function updateSerchProductPagination(){


    const prevProducts=document.getElementById('prevProducts')  
    const nextProducts=document.getElementById('nextProducts')
   
      
    prevProducts.disabled= page==1 ;
    nextProducts.disabled= page == totalProductPages;
}

function prevProducts(){

    if (page > 1) {
                
        page--;
        updateSerchProductPagination()
        findProductFilters(page)
    }
  }
  
  function nextProducts(){

    if ( page < Number(totalProductPages)) {

        page++;
        updateSerchProductPagination()
        findProductFilters(page)
    }
  }


function findProductFilters(productsPage=1,sort){
    const productName=document.getElementById('productSearchKey').value;
    const categoryElements=document.getElementsByName('category')
    let categories=[]
    for(let element of categoryElements){
        if(element.checked){
            categories.push(element.value)
        }
    }


    let brands=[]
    const brandElements=document.getElementsByName('brand')
    for(let element of brandElements){
        if(element.checked){
            brands.push(element.value)
    
        }
    }
   

    const upperValue=document.getElementById('upper-value').innerHTML;
    const lowerValue=document.getElementById('lower-value').innerHTML;
    const priceRange={
        max:upperValue,
        min:lowerValue
    }

    if(!sort){
        sort=document.querySelector('.nice-select .selected').getAttribute('data-value');
    }

   
    findProducts(productName,categories,brands,priceRange,productsPage,sort)

}

function findProducts(name,categories,brands,priceRange,page,sort){
   
    
    fetch(`/searchProducts`,{ 
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ name:name, categories:categories, brands:brands,priceRange:priceRange,page:page,sort:sort})
    })
    .then(response=>{
        if(response.status==401){
            window.location.href='/login'
            return
        }
        
        if(response.ok) return response.json() 
        throw { status: response.status, data: response.json() };
    })
    .then(data=>{
        
        if(data.products){
            document.getElementById('curProductPage').innerHTML=data.page
            page=data.page
            totalProductPages=data.totalPages
  
            displaySearchresult(data.products,data.cart)
          
        }else{
            showNoResult()
        }

    })
    .catch(handleError)
 
}


document.getElementById('mainContainer').addEventListener('input',(e)=>{
    if(e.target.classList.contains('product-search')){
        page=1
        findProductFilters()
    }
})

document.addEventListener('DOMContentLoaded', function() {
    const list = document.querySelector('.list');
    list.addEventListener('click', (event) => {
        const selectedOption = event.target.getAttribute('data-value');
        page=1
        findProductFilters(1,selectedOption)
    },true);
});

function displaySearchresult(products,cart){

    document.getElementById('searchedProductList').innerHTML=''                             

        for(let product of products){

            const productDiv=document.createElement('div')
            productDiv.classList='col-lg-3 col-12'
        
            //CHECK PRODUCT IS ALREADY IN CART
            let InCart = cart ? cart.cartItems?.some(item => item.product.toString()== product._id.toString()) : false
            let cartOption=``
            
            if(!InCart && product.stock > 0){
                cartOption=`
                <a href="#"  class="d-flex align-items-center justify-content-center m-1 popOver-btn-white searchAction" productId="${product._id}" easyAddToCart>
                            
                <span class="mr-1 searchAction text-capital" productId="${product._id}" easyAddToCart> Add To Cart </span><i class="mdi mdi-cart searchAction" productId="${product._id}" easyAddToCart></i>
            </a>
                `
            }else if(InCart){
                cartOption=`
                <a href="/api/goToCart"  class="d-flex align-items-center justify-content-center m-1 popOver-btn-white">
                            
                <span class="mr-1 text-capital"> GO To Cart </span><i class="mdi mdi-cart "></i>
                </a>
                `
            }

            //SETTING OFFER BADGE
            let offer=''
            let rating=''
            let price=`<span class="product-price">&#8377;${ product.price}</span>`
            
            if(product.effectedDiscount && product.effectedDiscount > 0){
                offer=`<div class="badge-area-show">
                            <div class="bagde-flag-wrap">
                            <a href="#" class="bagde-flag"> ${product.effectedDiscount}% off </a>
                            </div>
                        </div>`

                        price=`<span class="l-through mr-2">&#8377;${ product.price}</span>
                        <span class="product-price ">&#8377; ${product.price-(product.price*product.effectedDiscount)/100}</span>`
            }
            if(product.rating?.length>0){
                const overallRating = product.rating.reduce((sum, r) => sum + r.value, 0) / product.rating.length;
                    const fullStars = Math.floor(overallRating);
                    const hasHalfStar = overallRating - fullStars > 0.4; 
                    for(let i=0;i < fullStars ; i++){ 
                        rating+=`<i class="mdi mdi-star text-warning"></i>`
                    }
                    if (hasHalfStar) { 
                        rating+=`<i class="mdi mdi-star-half text-warning"></i>`
                    }
            }
        	
            productDiv.innerHTML= ` <div class="single1-product">
           ${offer}
            <div class="" style="position: relative;">
                <a href="/productDetails?id=${product._id}" target="_blank">
                <div class="overlay-div">
                <div class="product1-image-container">
                    <img class="img-fluid w-100 product1-image" src="/static/productImages/${product.images[0]}" alt="">
                
                </div>
                <div class="overlay"></div>
                </div>
                </a>
                <div class="prod-actions w-100">

                    <div class="d-flex justify-content-around px-1">
                        <a href="/productDetails?id=${product._id}"  class="d-flex align-items-center justify-content-center m-1 popOver-btn-dark">
                            
                            <span class="mr-1"> View More </span><i class="mdi mdi-eye"></i>
                        </a>
                        
                            
                        ${cartOption}

                    </div>

                    
                </div>   
                
            </div>

            <div class="p-3 product-details">
                <h6 class="deal-title mb-3">${product.name}</h6>
                <div class="d-flex ">
                    
                    <div class="pricing">
                       ${price}
                    </div>
                    <div class="rating">
                    ${rating}
                    </div>
                </div>
            </div>
        </div>`
        
                document.getElementById('searchedProductList').appendChild(productDiv)
        }
    
}

function showNoResult(){
    const div=document.createElement('div')
    
    div.classList='col-lg-12 noresultDiv p-3'
    div.innerHTML=`
                    
                    <div class="d-flex justify-content-center">
                    <lottie-player src="https://lottie.host/a7470a7f-8508-464a-a71c-9926c8f04ab1/wemUnPijfZ.json" background="##ffffff" speed="1" style="width: 300px; height: 300px" loop  autoplay direction="1" mode="normal"></lottie-player>
                    </div>
                    <div class='noresultHead'>
                    <h3>No results found..!</h3>
                    </div>
                    `

    document.getElementById('searchedProductList').innerHTML=''
    document.getElementById('searchedProductList').appendChild(div)

}


$(function(){

    if(document.getElementById("price-range")){
    
    var nonLinearSlider = document.getElementById('price-range');
    
    noUiSlider.create(nonLinearSlider, {
        connect: true,
        behaviour: 'tap',
        start: [ 500, 4000 ],
        range: {
            // Starting at 500, step the value by 500,
            // until 4000 is reached. From there, step by 1000.
            'min': [ 0 ],
            '10%': [ 500, 500 ],
            '50%': [ 4000, 1000 ],
            'max': [ 10000 ]
        }
    });


    var nodes = [
        document.getElementById('lower-value'), // 0
        document.getElementById('upper-value')  // 1
    ];

    // Display the slider value and how far the handle moved
    // from the left edge of the slider.
    nonLinearSlider.noUiSlider.on('update', function ( values, handle, unencoded, isTap, positions ) {
        nodes[handle].innerHTML = values[handle];
    });

            // Trigger a search on the server when the user stops sliding
            nonLinearSlider.noUiSlider.on('end', function () {
                page=1
              // Send a request to the server with the updated price range
              findProductFilters()
          });

    }

});
}


function addSingleProductToCart(productId,quantity){
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
        if(response.status==401){
            window.location.href='/login'
            return
        }
        
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
                
                setEasyGotoCart(productId)
                cartCount.style.display='flex'
                cartCount.innerHTML=data.count

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

function setEasyGotoCart(productId){
   
    const addToCartBtns=document.querySelectorAll(`[productId="${productId}"]`)
   
    for(let btn of addToCartBtns){
        btn.classList.remove('searchAction')
        // btn.classList.remove('easyAddToCart')
        btn.removeAttribute('easyAddToCart')
    
        btn.setAttribute('href','/api/goToCart')
        btn.innerHTML=`
        <span class="mr-1"> GO To Cart </span><i class="mdi mdi-cart "></i>
        `
    }
  

}