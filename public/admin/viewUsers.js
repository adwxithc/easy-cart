
//pagination
function pagination(){

    if(document.getElementById("current")){

    var prev=document.getElementById('prev')
    var currentBtn=document.getElementById("current")
    var next=document.getElementById("next")


    var totalpages=document.getElementById("totp").value
    var currentPage = document.getElementById("cur").value
    


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
                if(response.status==401){
                    window.location.href='/admin'
                    return
                  }
                if (!response.ok) {
                    throw { status: response.status, data: response.json() };
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
            .catch(handleError);
        }
    }

}
pagination()




//block Or UnblockUser
function blockOrUnblockUser(){
    const status=document.querySelectorAll(".status")
    status.forEach(statusBtn=>{
        statusBtn.addEventListener('click',function(){
            const userId=this.getAttribute("userId")

            const modal = document.getElementById('myModal');
            modal.style.display = 'block';
            modal.setAttribute('data-user-id', userId);

            // changeStatus(userId)
        })

    })

    document.getElementById('closeBtn').addEventListener('click', () => {
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
      });

      document.getElementById('confirmBtn').addEventListener('click', () => {
        
        
        const userId = document.getElementById('myModal').getAttribute('data-user-id');
        
        changeStatus(userId)
        
        // Close the modal after handling the action
        document.getElementById('myModal').style.display = 'none';
      });

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
            if(response.status==401){
                window.location.href='/admin'
                return
              }
            if(response.ok)return response.json()
            throw { status: response.status, data: response.json() };

        })
        .then(data=>{

            showMessage(data.message)
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
        .catch(handleError)
    }


}
blockOrUnblockUser()



//Search
function searchUser(){
   
  
    document.getElementById("userSearch").addEventListener('submit',function(e){
     
      
      e.preventDefault()
      const searchKey=document.getElementById("searchKey").value
      
      fetch(`/admin/searchUser?key=${searchKey}`)
      .then(response =>{
        if(response.status==401){
            window.location.href='/admin'
            return
          }
        if(!response.ok){
            throw { status: response.status, data: response.json() };
        }
        const contentType = response.headers.get("content-type");
  
        if (contentType && contentType.includes("application/json")) {
          return response.json(); // Parse JSON response
        } else {
          return response.text(); // Assume HTML content
        }
      })
      .then((data) => {
  
        // Check if the response is JSON or HTML
        if (typeof data === 'object') {
          // Handle JSON response (e.g., error)
          showMessage(data.message)
         
        } else {
          // Handle HTML response
          document.getElementById('pageContent').innerHTML = data;
  
          const scriptSrc='/static/admin/viewUsers.js'
          const scriptexist=document.querySelector(`script[src="${scriptSrc}"]`)
  
          if(scriptexist){
              scriptexist.parentNode.removeChild(scriptexist);
          }
  
  
          const script2=document.createElement('script');
          script2.src=scriptSrc;
          document.body.appendChild(script2);
  
        }
      })
      .catch(handleError);
    })
  
  }
  searchUser()
  

