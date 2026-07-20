if(sessionStorage.getItem('userEmail')){
    document.getElementById('email').value = sessionStorage.getItem('userEmail');
}
let errMsg = document.getElementById('errorMsg');

document.getElementById('loginBtn').addEventListener('click', async (e)=>{
    
    e.target.disabled = true;
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();

    if(!email || !password){
        errMsg.style.display = 'block'
        errMsg.innerHTML = 'all fields are required';
    }

    const res = await login(email,password);

    if(res && res.success){
        sessionStorage.setItem('userEmail',email);
        window.location.href = './dashboard.html';
    }
    else{
        e.target.disabled = false;
        errMsg.style.display = 'block'
        errMsg.innerHTML = res.data.message;
    }
});