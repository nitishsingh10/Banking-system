const email = sessionStorage.getItem('otpEmail');

document.getElementById('submitOtp').addEventListener('click',async ()=>{

    const otp = document.getElementById('otpField').value.trim();

    if(!otp){
        return alert('please Enter the OTP');
    }

    const res = await verifyOtp(otp,email);

    if(res && res.ok){
        window.location.href = './login.html';
    }
    else{
        alert('error : ' +res.data.message);
    }
})