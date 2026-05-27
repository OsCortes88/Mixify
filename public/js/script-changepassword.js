const form = document.querySelector(#changepassword);
form.addEventListener('submit', async(e)=>{
  e.preventDefault;
  const currentPassword = form.currentPassword.value;
  const newPassword = form.newPassword.value;

  const response = await fetch('/changePassword',{
    method: "POST",
    body: JSON.stringify({currentPassword, newPassword}),
    header: {
      'Content-Type': 'application/json'
      }
    });
    const data = await respose.json();

    if(response.ok){
       window.location.href ='/';
      }else{
        console.error(data.message)
    }
  });