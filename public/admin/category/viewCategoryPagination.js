

function viewCategory(){
  
// pagination
if(document.getElementById("current")){

  let prev=document.getElementById('prev')
  let currentBtn=document.getElementById("current")
  let next=document.getElementById("next")
  
  let totalpages1=document.getElementById("totp").value
  let currentPage1 = document.getElementById("cur").value
  
  
  
  // function updatepagination(){
      
      
  //     // prev.disabled= currentPage1==1 ;
  //     // next.disabled= currentPage1 == totalpages1;
  //     // currentBtn.textContent=currentPage1;
  // }
  
  // updatepagination()
  
  
      prev.addEventListener('click', function(e) {
          
          if (currentPage1 > 1) {
              
              
              currentPage1--;
              // updatepagination();
              // fetchDataForPage(currentPage1);
              loadPage(`/admin/viewCategory?page=${currentPage1}`,[viewCategory])

          }
      });
      
      next.addEventListener('click', function(e) {
          
          
          if (currentPage1 < totalpages1) {
              currentPage1++;
              // updatepagination();
  
              // fetchDataForPage(currentPage1);
              loadPage(`/admin/viewCategory?page=${currentPage1}`,[viewCategory])
          }
      });
      
      // function fetchDataForPage(Page){
         
      //     const url = `/admin/viewCategory?page=${Page}`;
  
      //     // Make a GET request to the server
      //     fetch(url)
      //     .then(response => {
      //       if(response.status==401){
      //         window.location.href='/admin'
      //         return
      //       }
      //         if (!response.ok) {
      //           throw { status: response.status, data: response.json() };
      //         }
      //         return response.text();
      //     })
      //     .then(html => {
      //         // Update the pageContent div with the loaded HTML
      //         pageContent.innerHTML = html;
  
      //         const scriptSrc='/static/admin/viewCategoryPagination.js'
      //         const scriptexist=document.querySelector(`script[src="${scriptSrc}"]`)
  
      //         if(scriptexist){
      //             scriptexist.parentNode.removeChild(scriptexist);
      //         }
  
  
      //         const script2=document.createElement('script');
      //         script2.src=scriptSrc;
      //         document.body.appendChild(script2);
      
      //     })
      //     .catch(handleError);
      // }
    }
  
  
  
  //listing and unlisting
  function listUnlist(){
  // unlist and list
  const statusButtons = document.querySelectorAll('.status');
  
  statusButtons.forEach(button => {
      button.addEventListener('click', function () {

        const categoryID = this.getAttribute('categoryId');
        console.log('categoryID',categoryID);
  
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';
        modal.setAttribute('data-user-id', categoryID);
  
        // listUnlistCategory(categoryID);
      });
    });
  
  
    
    document.getElementById('closeBtn').addEventListener('click', () => {
      const modal = document.getElementById('myModal');
      modal.style.display = 'none';
    });
  
  
    document.getElementById('confirmBtn').addEventListener('click', () => {
          
          
      const categoryID = document.getElementById('myModal').getAttribute('data-user-id');
      
      listUnlistCategory(categoryID)
      
      // Close the modal after handling the action
      document.getElementById('myModal').style.display = 'none';
    });
  
  
  
    function listUnlistCategory(categoryID) {
      
      fetch('/admin/listOrUnlistCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryID: categoryID })
      })
      .then(response => {
        if(response.status==401){
          window.location.href='/admin'
          return
        }
        if (response.ok) return response.json();
       
        throw { status: response.status, data: response.json() };
        
      })
      .then(data => {
  
        showMessage(data.message)
  
        const categoryRow = document.getElementById(categoryID);
        
  
        // Update the status within the table row based on the response data
        const statusChanger=categoryRow.querySelector(".status")
        
  
        const statusElement = categoryRow.querySelector('.text-success, .text-danger');
        
        if (data.status === 'listed') {
  
          statusElement.textContent = 'listed';
          statusElement.classList.remove('text-danger');
          statusElement.classList.add('text-success');
  
          statusChanger.innerHTML="unlist"
  
        } else if (data.status === 'unlisted') {
  
          statusElement.textContent = 'unlisted';
          statusElement.classList.remove('text-success');
          statusElement.classList.add('text-danger');
  
          statusChanger.innerHTML="list"
  
        }
      })
  
      .catch(handleError);
    }
  
  }
  listUnlist()
  
  
  
  //load edit category
  
  function loadeditCategory(){
    const editButtons=document.querySelectorAll(".edit")
    editButtons.forEach(editBtn=>{
      editBtn.addEventListener('click',function(){
        const categoryId=this.getAttribute("categoryId")
  
        loadPage(`/admin/loadeditCategory?id=${categoryId}`,[editCategory])

        // editCategory(categoryId)
      })
    })
  
    // function editCategory(id){
     
    //   fetch(`/admin/loadeditCategory?id=${id}`)
    //   .then(response =>{
    //     if(response.status==401){
    //       window.location.href='/admin'
    //       return
    //     }
    //     if(!response.ok){
    //       throw { status: response.status, data: response.json() };
    //     }
    //     const contentType = response.headers.get("content-type");
  
    //     if (contentType && contentType.includes("application/json")) {
    //       return response.json(); // Parse JSON response
    //     } else {
    //       return response.text(); // Assume HTML content
    //     }
    //   })
    //   .then((data) => {
  
    //     // Check if the response is JSON or HTML
    //     if (typeof data === 'object') {
    //       // Handle JSON response (e.g., error)
          
    //       document.getElementById("alertMessage").innerHTML=data.message
    //       document.getElementById("alertMessage").classList.add("text-info")
    //       clearAlert()
    //       // You can handle the JSON data here, e.g., display an error message
    //     } else {
    //       // Handle HTML response
    //       document.getElementById('pageContent').innerHTML = data;
  
    //       const script=document.createElement('script');
    //       script.src='/static/admin/editCategory.js';
    //       document.body.appendChild(script);
    //     }
    //   })
    //   .catch(handleError);
  
    // }
  
  }
  loadeditCategory()
  
  
  
  //categorySearch
  function categorySearch(){
    
    document.getElementById("categorySearch").addEventListener('submit',function(e){
     
      
      e.preventDefault()
      const searchKey=document.getElementById("searchKey").value
      
      fetch(`/admin/categorySearch?key=${searchKey}`)
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
          // You can handle the JSON data here, e.g., display an error message
        } else {
          // Handle HTML response
          document.getElementById('pageContent').innerHTML = data;
  
          const scriptSrc='/static/admin/viewCategoryPagination.js'
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
  categorySearch()
}


