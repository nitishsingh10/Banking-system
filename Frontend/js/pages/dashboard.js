const email = sessionStorage.getItem('userEmail');

document.getElementById('userEmail').textContent = email;
document.getElementById('checkBalanceBtn').addEventListener('click', async () =>{

    const balanceText = document.getElementById('balance');

    balanceText.textContent = 'loading...';

    const balance = await checkBalance();

    setTimeout(()=>{
        if(balance && balance.success){ 
            balanceText.textContent = 'your current balance : ' + balance.data.balance;
            balanceText.style.color = 'green';
        }
        else{
            balanceText.textContent = 'could not fetch the balance :' + balance.data.message;
            balanceText.style.color = 'red';
        }
    },1500);

    
})

const history = async () => {
    const transactions = await transactionHistory();
    showTransactionHistory(transactions.data);
}

history(); // autopopulate the history of transactions in main dashboard

function showTransactionHistory(transaction) {
    const transactionList = document.getElementById('transactionList');

    if (!transaction.transactions || transaction.transactions.length === 0) {
        transactionList.innerHTML = '<h3>No transactions yet !</h3>';
        return;
    }

    transactionList.innerHTML = '';
    transaction = transaction.transactions.toReversed();
    let count = 0;
    transaction.forEach(tx => {
        if(count >= 7) return; // fix no of transaction history on dashboard
        
        const dateStr = new Date(tx.date).toLocaleString();
        let typeColor, cardClass;
        if(tx.type === 'credit'){
            typeColor = 'green';
            cardClass = 'credit';
        } else if(tx.type === 'debit'){
            typeColor = 'red';
            cardClass = 'debit';
        } else {
            typeColor = 'blue';
            cardClass = 'deposit';
        }
        
        const li = document.createElement('li');
        li.style.width = '100%';
        li.style.display = 'block';
        li.innerHTML = `<div class="transaction-card ${cardClass}">
            <p>Type: <span style="color:${typeColor}">${tx.type}</span></p>
            <p>Amount: <span style="color:${typeColor}">${tx.amount}</span></p>
            <p>Note: ${tx.description}</p>
            <p>Date: ${dateStr}</p>
        </div>`;
        transactionList.appendChild(li);
        count++;
    });
}

document.getElementById('logoutBtn').addEventListener('click', async ()=>{
    await logout();
})