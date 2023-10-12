
//pagination
function pagination(){


var prev=document.getElementById('prev')
var currentBtn=document.getElementById("current")
var next=document.getElementById("next")


var totalpages=document.getElementById("totp").value
var currentPage = document.getElementById("cur").value
console.log("currentPage",currentPage)


function updatepagination(){
    
    console.log("updatepagination",currentPage)
    prev.disabled= currentPage==1 ;
    next.disabled= currentPage == totalpages;
    currentBtn.textContent=currentPage;
}

updatepagination()


    prev.addEventListener('click', function(e) {
        
        if (currentPage > 1) {
            console.log(currentPage,"prev",e.target)
            
            currentPage--;
            updatepagination();
            fetchDataForPage(currentPage);
        }
    });
    
    next.addEventListener('click', function(e) {
        console.log(currentPage,"next",e.target)
        
        if (currentPage < totalpages) {
            currentPage++;
            updatepagination();

            fetchDataForPage(currentPage);
        }
    });
    
    function fetchDataForPage(Page){
        console.log("fetchDataForPage",Page)
        const url = `/admin/loadUsers?page=${Page}`;

        // Make a GET request to the server
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Update the pageContent div with the loaded HTML
            pageContent.innerHTML = html;

            const scriptSrc='/static/admin/viewUsers.js'
            const scriptexist=document.querySelector(`script[src="${scriptSrc}"]`)

            if(scriptexist){
                scriptexist.parentNode.removeChild(scriptexist);
            }

            const script2=document.createElement('script');
            script2.src=scriptSrc;
            document.body.appendChild(script2);
    
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }

}
pagination()


//block Or UnblockUser
function blockOrUnblockUser(){
    const status=document.querySelectorAll(".status")
    status.forEach(statusBtn=>{
        statusBtn.addEventListener('click',function(){
            const userId=this.getAttribute("userId")
        
            changeStatus(userId)
        })

    })
    function changeStatus(id){
        const jsonData=JSON.stringify({id:id})
        fetch('/admin/blockOrUnblockUser',{
            method:"PATCH",
            
            headers:{
                'Content-Type': 'application/json'
            },
            body:jsonData
        })
        .then(response=>{
            if(response.ok){
                return response.json()

            }else{
                throw new Error("Unable TO Change Status")
            }
        })
        .then(data=>{
            document.getElementById("alertMessage").innerHTML=data.message
            document.getElementById("alertMessage").classList.add("text-info")
            clearAlert()
            const statusBtn=document.querySelector(`[userId='${id}']`)
            if(data.status=='blocked'){
                statusBtn.textContent='unblock';
                statusBtn.classList.remove('btn-outline-danger');
                statusBtn.classList.add('btn-outline-success');
            }else{
                statusBtn.textContent='block';
                statusBtn.classList.remove('btn-outline-success');
                statusBtn.classList.add('btn-outline-danger');
            }
        })
        .catch(error=>{
            document.getElementById("alertMessage").innerHTML=error.message
        })
    }


}
blockOrUnblockUser()