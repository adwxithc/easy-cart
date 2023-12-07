let seconds=0,timerInterval,expire=0
function starTimer(){
     expire=document.getElementById('expire').value
     seconds = Math.floor((expire - (Date.now()/ 1000)) ); 
    

     timerInterval=setInterval(updateTimer, 1000);
}
setTimeout(()=>{
    document.getElementById('alertMessage').innerHTML=''
},3000)


function updateTimer() {
    // If the timer reaches zero, stop the interval
    if (seconds <= 0) {
      clearInterval(timerInterval);
      document.getElementById('timer').innerText = "00:00";
    } else {
      // Decrement seconds
      seconds--;

      // Calculate minutes and remaining seconds
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      // Display the timer in MM:SS format
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      document.getElementById('timer').innerText = formattedTime;
    }
  }



//resend otp in user otp verification @ sign up
document.addEventListener('DOMContentLoaded', function () {

starTimer()


    document.getElementById('resendOtp').addEventListener('click', function (e) {
      e.preventDefault();
  
      // Disable the button and change its color
      this.style.color = 'rgba(0, 0, 255, 0.305)';
      this.disabled = true;
  
      setTimeout(() => {
        // Enable the button and restore its color after 30 seconds
        this.style.color = 'rgba(0, 0, 255, 0.668)';
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
          alert(data.expire)
          alert(data.message)
          if(data.expire){
            clearInterval(timerInterval)
            expire=data.expire
            starTimer()
          }
          
          document.getElementById('resendInfo').innerHTML = data.message;
        })
        .catch(handleError)
    });
  });
  
  function validateOtp(){
    let isValid=true
    const otp=document.getElementById('otp').value.trim()
    const otpError=document.getElementById('otpError')
    if(!otp){
         otpError.innerHTML="otp can't be null"
         isValid=false
    }
    else if(otp.length<6){
         otpError.innerHTML='otp should contain more than 6 characters';
         isValid=false
    }
    return isValid
  }

function clearError(id){
    document.getElementById(id).innerHTML=''
}

      
function handleError(error) {
     
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error: Unable to reach the server.');
      // Optionally show a user-friendly message to the user
    } else {
      error.data.then(data => {
        console.error('Fetch error:', error);
        const queryParams = new URLSearchParams({
          statusCode: data.statusCode,
          message: data.message,
          status: data.status,
          homeLink: data.homeLink,
        });
        console.log(queryParams.toString())
        window.location.href = `/error?${queryParams.toString()}`;
      });
    }
  }
  