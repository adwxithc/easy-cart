const alertMessage=document.getElementById('alertMessage')
// remove alert message after 3 second
if(alertMessage){
    setTimeout(()=>{
        alertMessage.style.display='none';
    },3000)
}

//resend otp in user otp verification @ sign up
$(function(){
    $('#resendOtp').on('click',function(e){
      e.preventDefault()
      $('#resendOtp').css('color','rgba(78, 71, 70, 0.707)')
      $('#resendOtp').prop('disabled',true)

      setTimeout(()=>{
        $('#resendOtp').css('color','blue')
        $('#resendOtp').prop('disabled',false)
        $("#resendInfo").html("")
      },30000)

      console.log("hellow")
      $.ajax({
        url:'/reSendOtp',
        method:"GET",
        success:function(res){
          $("#resendInfo").html(res.message)
          console.log(res)
        },
        error:function(){
          $("#resendInfo").html("Some error occured please try again after some time")


        }
      })
    })
  })

  function clearAlert(){
    if(document.getElementById("alertMessage")){
        setTimeout(()=>{
            document.getElementById("alertMessage").innerHTML='';
        },3000)
    }}