const form = document.querySelector('#changeUsername');

  form.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const currentUsername = form.currentUsername.value;
    const newUsername = form.newUsername.value;

    const response = await fetch('/changeUsername',{
      method: "POST",
      body: JSON.stringify({currentUsername, newUsername}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  const data = await response.text();

  if(response.ok){
    alert(data);
    window.location.href ='/';
    }else{
      console.error(data);
    }
  });