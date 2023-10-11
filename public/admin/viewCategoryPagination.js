

// pagination

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
        const url = `/admin/viewCategory?page=${Page}`;

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

            const scriptSrc='/static/admin/viewCategoryPagination.js'
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



function listUnlist(){
// unlist and list
const statusButtons = document.querySelectorAll('.status');

statusButtons.forEach(button => {
    button.addEventListener('click', function () {
      const categoryID = this.getAttribute('categoryId');
      unlistCategory(categoryID);
    });
  });

  function unlistCategory(categoryID) {
    
    fetch('/admin/listOrUnlistCategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ categoryID: categoryID })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to unlist category');
      }
    })
    .then(data => {
      // Handle the successful response
      document.getElementById("alertMessage").innerHTML=data.message
      document.getElementById("alertMessage").classList.add("text-info")
      clearAlert()

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

    .catch(error => {
      // Handle errors
      document.getElementById("alertMessage").innerHTML="Unable to change status"
      clearAlert
      console.error(error.message);
    });
  }

}
listUnlist()
