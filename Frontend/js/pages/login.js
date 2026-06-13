document.getElementById('loginBtn').addEventListener('click', async ()=>{

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if(!email || !password){
        return alert('all fields are required');
    }

    const res = await login(email,password);

    if(res && res.ok){
        window.location.href = './dashboard.html';
    }
    else{
        alert('error : ' + res.data.message);
    }
})