const form = document.querySelector(#changeEmail);

form.addEventListener('submit', async(e)=>{
  e.preventDefault;
  const currentEmail = form.currentEmail.value;
  const newEmail = form.newEmail.value;

  const response = await fetch('/changeEmail',{
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