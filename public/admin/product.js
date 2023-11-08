function validateProductData(formData,formId){
    
    const name=formData.get('name')
    const description=formData.get('description')
    const category=formData.get('category')
    const stock=formData.get('stock')
    const price=formData.get('price')
    const size=formData.get('size')
    const images=formData.get('images')


    const nameError=document.getElementById('nameError')
    const descriptionError=document.getElementById('descriptionError')
    const categoryError=document.getElementById('categoryError')
    const stockError=document.getElementById('stockError')
    const priceError=document.getElementById('priceError')
    const imagesError=document.getElementById('imagesError')
    const sizeError=document.getElementById('sizeError')

    document.getElementById(formId).addEventListener('click',(e)=>{
        if(e.target.id=='name') nameError.innerHTML=''
        else if(e.target.id=='description') descriptionError.innerHTML=''
        else if(e.target.id=='categorylist') categoryError.innerHTML=''
        else if(e.target.id=='stock') stockError.innerHTML=''
        else if(e.target.id=='price') priceError.innerHTML=''
        else if(e.target.id=='size') sizeError.innerHTML=''
        else if(e.target.id=='image-upload') imagesError.innerHTML=''

    },true)

if(!(name&&description&&category&&stock&&price&&size&&images)){
    if(!name) nameError.innerHTML="product name can't be null";

    if(!description) descriptionError.innerHTML="description can't be null";
        
    if(!category) categoryError.innerHTML="category can't be null";
        
    if(!stock) stockError.innerHTML="stock can't be null";
        
    if(!price) priceError.innerHTML="price can't be null";
        
    if(!images) imagesError.innerHTML="images can't be null";
        
    if(!size) sizeError.innerHTML="size can't be null";
        
    return false
}else if(isNaN(stock)){
    stockError.innerHTML="stock should be a number";
    return false
}else if(stock<0){
    stockError.innerHTML="stock should be a positive number";
    return false
}else if(isNaN(price)){
    stockError.innerHTML="price should be a number";
    return false
}else if(price<0){
    stockError.innerHTML="price should be a positive number";
    return false
}else{
    return true
}



   
}