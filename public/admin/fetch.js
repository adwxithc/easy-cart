var pageContent = document.getElementById('pageContent');


// view category

const viewCategory = document.getElementById('view-category');


viewCategory.addEventListener('click', () => {
    // Specify the URL of the page you want to load
    const pageUrl = '/admin/viewCategory';

    fetch(pageUrl)
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
});





// add category


const loadPageButton = document.getElementById('add-category');


loadPageButton.addEventListener('click', () => {
    // Specify the URL of the page you want to load
    const pageUrl = '/admin/addCategory';

    fetch(pageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Update the pageContent div with the loaded HTML
            pageContent.innerHTML = html;


            const scriptSrc='/static/admin/addCategoryPost.js'
            const scriptexist=document.querySelector(`script[src="${scriptSrc}"]`)

            if(scriptexist){
                scriptexist.parentNode.removeChild(scriptexist);
            }

            const script=document.createElement('script');
            script.src=scriptSrc;
            document.body.appendChild(script);
            
            

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

