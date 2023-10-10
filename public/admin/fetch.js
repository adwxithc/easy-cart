// view category






// add category


const loadPageButton = document.getElementById('add-category');
const pageContent = document.getElementById('pageContent');

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

            const script=document.createElement('script');
            script.src='/static/admin/addCategoryPost.js'
            document.body.appendChild(script);

            

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

