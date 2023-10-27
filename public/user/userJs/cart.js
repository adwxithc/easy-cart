    const modal = document.getElementById("confirmationModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const confirmBtn = document.getElementById("confirmBtn");

    // Open the modal
    // openModalBtn.onclick = function() {
    //     modal.style.display = "block";
    // }

    function remove(productId){
        modal.style.display = "block";
        modal.setAttribute('product',productId)

            // Close the modal when the close button is clicked
    closeModalBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal when the user confirms
    confirmBtn.onclick = function() {
        modal.style.display = "none";
        const id=modal.getAttribute('product')
        removeFromCart(id)
       
        // You can add your confirmation logic here
    }

    // Close the modal if the user clicks outside of it
    // window.onclick = function(event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //     }
    // }

    }






function removeFromCart(productId){
    
    fetch(`/api/removeFromCart?productId=${productId}`,{
        method:'DELETE',

    })
    .then(response=>{
        if(response.ok) return response.json()
        throw new Error('unable to connect to the server')
    })
    .then(data=>{
        showModal(data.message)
        setTimeout(()=>{
            closeModal()
        },1100)
        productId=productId.toString()
        console.log(productId)
        const id =productId.toString().trim()
        document.getElementById(id).style.display='none'
       
    })
    .catch((er)=>{
        console.log(er.message)
        showModal('Some error occured')
        setTimeout(()=>{
            closeModal()
        },1100)

    })
}