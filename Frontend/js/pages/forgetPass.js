let errMsg = document.getElementById('errorMsg');
document.getElementById('sendOtp').addEventListener('click',async (e)=>{
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const email = emailInput?.value.trim().toLowerCase();

    if(!email){
        errMsg.style.display = 'block'
        return errMsg.innerHTML = 'Please enter your registered mail';
    }

    e.target.style.color = 'red'
    e.target.style.pointerEvents = 'none'
    const res = await forgetPassword(email);
    sessionStorage.setItem('userEmail',email);

    if(res && res.success){
        document.getElementById('OTP').disabled = false;
        document.getElementById('newPassword').disabled = false;
        emailInput.disabled = true;
        let time = 30;
        let tId = setInterval(() => {
            time--;
            e.target.innerHTML = `OTP sent! resend in ${time}`
        }, 1000);
        
        setTimeout(()=>{
            clearInterval(tId);
            time = 0;
            e.target.innerHTML = `Resend OTP`
            e.target.style.pointerEvents = 'auto'
        },1000*30)
    }
    else{
        errMsg.style.display = 'block';
        errMsg.innerHTML = `${res.data.message}`
    }

})

document.getElementById('resetBtn').addEventListener('click', async (e)=>{
    e.target.disabled = true
    errMsg.style.display = 'none'

    const email = sessionStorage.getItem('userEmail');
    const otp = document.getElementById('OTP').value.trim();
    const password = document.getElementById('newPassword').value.trim();

    if(!email || !otp || !password){
        errMsg.style.display = 'block'
        return errMsg.innerHTML = 'all fields are required';
    }

    const res = await resetPassword(email,otp,password);

    if(res && res.success){
        alert('Password changed successfully');
        window.location.href = './login.html';
    }
    else{
        e.target.disabled = false
        errMsg.style.display = 'block'
        errMsg.innerHTML = 'error : ' +res.data.message;
    }
})