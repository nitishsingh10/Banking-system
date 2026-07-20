let errMsg = document.getElementById('errorMsg');
document.getElementById('registerBtn').addEventListener('click',async (e)=>{
    
    e.target.disabled = true;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    if(!name || !email || !password || !phone || !address){
        errMsg.style.display = 'block'
        errMsg.innerHTML = 'all fields are required';
    }

    const res = await register(name,email,password,phone,address); // fields from the user

    if(res && res.success){
        sessionStorage.setItem('otpEmail',email);  // storing userEmail in session storage to further verify the otp
        window.location.href = './verify-otp.html';
    }
    else if(res.data.message == 'User already exists'){
        alert('User already exist, redirecting to login page');
        window.location.href = './login.html';
    }
    else{
        e.target.disabled = false;
        alert('error: ' + res.data.message);
    }
});