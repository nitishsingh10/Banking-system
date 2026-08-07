const userArea = document.getElementById('foundUser');
document.getElementById('receiverEmail').addEventListener('blur',async (e)=>{

    const email = e.target.value.trim();
    if(!email){
        userArea.innerHTML = '';
        return;
    }
    if(sessionStorage.getItem('userEmail')==email){
        userArea.style.color = 'red';
        userArea.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> Cannot send to the same account !`;
        return; 
    }

    const user = await getUser(email);

    if(user && user.success){
        userArea.style.color = 'green';
        userArea.innerHTML = `${escapeHtml(user.data.name)} <i class="bi bi-check-circle-fill"></i>`;
        return;
    }
    else{
        userArea.style.color = 'red';
        userArea.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> User not Found`;
        return;
    }

})
document.getElementById('sendBtn').addEventListener('click', async () => {

    const receiverEmail = document.getElementById('receiverEmail').value.trim();
    const amount = document.getElementById('amount').value.trim();
    const note = document.getElementById('note').value.trim();


    if(!receiverEmail || !amount){
        showError("Please fill all the required fields.");
        return;
    }

    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;

    const response = await sendMoney(receiverEmail, amount, note);
    
    
    if(response && response.data.success){
        userArea.innerHTML = '';
        let time = 30;
        let tId = setInterval(()=>{
            if(time>0){
                time--;
                sendBtn.textContent = `Cooldown ${time}`
            }
        },1000);
        setTimeout(() => {
            sendBtn.disabled = false;
            clearInterval(tId);
            sendBtn.textContent = `Send Funds Now`
        }, 30000);
    
        document.getElementById('receiverEmail').value = ''
        document.getElementById('amount').value = ''
        document.getElementById('note').value = ''
        showSlip(response.data);
    }
    else{
        showError(response.data.message)
        sendBtn.disabled = false;
    }
});

function showError(message){ // show error message in popup
    const slip = document.getElementById('transactionModal');
    document.getElementById('modalContent').classList.add('error');
    document.getElementById('modalDetails').innerHTML = `
        <h3>Transaction Failed</h3>
        <p>Error: ${message}</p>
    `
    slip.style.display = 'block';

    const closeBtn = document.getElementById('closeModalBtn');

    closeBtn.addEventListener('click', () => {
        slip.style.display = 'none';
        document.getElementById('modalContent').classList.remove('error');
    });

}

function showSlip(data){

    const slip = document.getElementById('transactionModal');

    document.getElementById('modalContent').classList.add('success');
    document.getElementById('modalDetails').innerHTML = `
        <h3>Transaction Successful</h3>
        <p>Amount: π${data.amount}</p>
        <p>Receiver: ${data.receiverEmail}</p>
        <p>Description: ${data.description}</p>
        <p>Transaction Reference: ${data.txnRef}</p>
    `
    slip.style.display = 'block';

    const closeBtn = document.getElementById('closeModalBtn');

    closeBtn.addEventListener('click', () => {
        slip.style.display = 'none';
        document.getElementById('modalContent').classList.remove('success');

    });
}
