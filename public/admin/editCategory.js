function postUpdation(){
    const form=document.getElementById("editCategoryForm")
    form.addEventListener('submit',(e)=>{
        e.preventDefault()
        async function updateCategory(){

            obj={
                categoryName:(document.getElementById("ctegoryName").value),
                categoryDescription:(document.getElementById("categoryDescription").value),
                id:(document.getElementById("Cid").value)
                
            }
            console.log(obj)
            const jsonData=JSON.stringify(obj)
            try {
                const response =await fetch('admin/editCategory',{
                    method:'PUT',
                    headers: {
                        'Content-Type': 'application/json' // Set the Content-Type header
                    },
                    body:jsonData
                })
                if(response.ok){
                    const data=await response.json()
                    document.getElementById("alertMessage").innerHTML=data.message
                    document.getElementById("alertMessage").classList.add("text-info")
                    clearAlert()

                }else{
                    alert("failed to update")

                }
                
            } catch (error) {
                console.log(error.message)
                
            }


        }
        updateCategory()
    })
}
postUpdation()