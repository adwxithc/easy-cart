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
        
        if(response.ok) return response.json() 
        throw new Error('connection to server error')
    })
    .then(data=>{
        
        if(data.products){
            document.getElementById('curProductPage').innerHTML=data.page
            page=data.page
            totalProductPages=data.totalPages
  
            displaySearchresult(data.products)
            console.log(totalProductPages)
        }else{
            showNoResult()
        }

    })
    .catch((error)=>{
        console.error(error)
        showModal('something went wrong')
    })
 
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

function displaySearchresult(products){
   

document.getElementById('searchedProductList').innerHTML=''
        for(let product of products){
        const productDiv=document.createElement('div')
        productDiv.classList='col-lg-3 col-6'
        let offer=''
        let price=`<h6 class="product-price">${ product.price}</h6>`
        if(product.effectedDiscount){
            offer=`<div class="badge-area-show">
                        <div class="bagde-flag-wrap">
                        <a href="#" class="bagde-flag"> ${product.effectedDiscount}% off </a>
                        </div>
                    </div>`

                    price=`<h6 class="product-price"> ${ Number(product.price)-((Number(product.price) * Number(product.effectedDiscount))/100) }</h6>
                    <h6 class="l-through product-original-price">${product.price}</h6>`
        }
       
        productDiv.innerHTML= `<div class="single-product productdiv">
        <div class="product-container">
        ${offer}

                    <div class="product-image-container">
                    
                        <a target="_blank"  href="/productDetails?id=${product._id}"><img class="img-fluid product-image" src="/static/productImages/${ product.images[0] }" alt=""></a>
                    </div>
                    <div class="product-details">
                        <h6 class="product-title">${ product.name}</h6>
                        <div class="price">
                            ${price}
                        </div>
                        <div class="prd-bottom">
                            <a href="" class="social-info">
                                <span class="ti-bag"></span>
                                <p class="hover-text">add to bag</p>
                            </a>
                            <a href="" class="social-info">
                                <span class="lnr lnr-heart"></span>
                                <p class="hover-text">Wishlist</p>
                            </a>

                            <a href="/productDetails?id=${product._id}" target='_blank' class="social-info">
                                <span class="lnr lnr-move"></span>
                                <p class="hover-text">view more</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>`
       
            document.getElementById('searchedProductList').appendChild(productDiv)
        }
    
}

function showNoResult(){
    const div=document.createElement('div')
    div.classList.add('noresultDiv')

    div.innerHTML=`<div class='noresultHead'>
                    <h3>NO RESULTS FOUND..!</h3>
                    </div>
                    <img src='/static/assets/bckImages/noResponse.jpg' class='noresultImg'>
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