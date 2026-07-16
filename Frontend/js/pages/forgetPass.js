document.getElementById('sendOtp').addEventListener('click',async (e)=>{
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const email = emailInput?.value.trim().toLowerCase();

    if(!email){
        return alert('Please enter your registered mail');
    }

    const res = await forgetPassword(email);
    
    if(res && res.success){
        e.target.style.color = 'red'
        emailInput.disabled = true;
        e.target.style.pointerEvents = 'none'
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
        alert('error : ' +res.data.message);
    }

})

document.getElementById('resetBtn').addEventListener('click', async ()=>{
    const email = document.getElementById('email')?.value;
    const otp = document.getElementById('otp')?.value;
    const password = document.getElementById('newPassword')?.value;

    if(!email || !otp || !password){
        return alert('all fields are required');
    }

    const res = await resetPassword(email,otp,password);

    if(res && res.success){
        alert('Password changed successfully');
        sessionStorage.setItem('userEmail',email);
        window.location.href = './login.html';
    }
    else{
        alert('error : ' +res.data.message);
    }
})