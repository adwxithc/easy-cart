const alertMessage=document.getElementById('alertMessage')
// remove alert message after 3 second
if(alertMessage){
    setTimeout(()=>{
        alertMessage.style.display='none';
        alertMessage.classList.remove('alertmsg');
    },3000)
}

//resend otp in user otp verification @ sign up
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('resendOtp').addEventListener('click', function (e) {
    e.preventDefault();

    // Disable the button and change its color
    this.style.color = 'rgba(78, 71, 70, 0.707)';
    this.disabled = true;

    setTimeout(() => {
      // Enable the button and restore its color after 30 seconds
      this.style.color = 'blue';
      this.disabled = false;
      document.getElementById('resendInfo').innerHTML = '';
    }, 30000);

    // Make a fetch request
    fetch('/reSendOtp', {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw { status: response.status, data: response.json() };
        }
        return response.json();
      })
      .then(data => {
        // Handle successful response
        document.getElementById('resendInfo').innerHTML = data.message;
      })
      .catch(handleError)
  });
});


  function clearAlert(){
    if(document.getElementById("alertMessage")){
        setTimeout(()=>{
            document.getElementById("alertMessage").innerHTML='';
        },3000)
    }}


    