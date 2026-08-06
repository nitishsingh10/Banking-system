const email = sessionStorage.getItem('userEmail');

document.getElementById('userEmail').textContent = email;
document.getElementById('checkBalanceBtn').addEventListener('click', async () =>{

    const balanceText = document.getElementById('balance');

    balanceText.textContent = 'loading...';

    const balance = await checkBalance();

    setTimeout(()=>{
        if(balance && balance.success){ 
            balanceText.textContent = 'your current balance : π' + balance.data.balance;
            balanceText.style.color = 'aliceblue';
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
        if(count >= 3) return;
        
        const dateStr = new Date(tx.date).toLocaleDateString();
        
        let cardClass, amountPrefix, counterpartyLabel, counterparty, counterpartyEmail;
        if(tx.type === 'credit'){
            // this entry belongs to the receiver's wallet -> other party is the sender
            cardClass = 'tx-credit';
            amountPrefix = '+';
            counterpartyLabel = 'From';
            counterparty = tx.senderId?.name || 'Unknown';
            counterpartyEmail = tx.senderId?.email || 'Unknown'
        } else if(tx.type === 'debit'){
            // this entry belongs to the sender's wallet -> other party is the receiver
            cardClass = 'tx-debit';
            amountPrefix = '-';
            counterpartyLabel = 'To';
            counterparty = tx.receiverId?.name || 'Unknown';
            counterpartyEmail = tx.receiverId?.email || 'Unknown'
        } else {
            cardClass = 'tx-deposit';
            amountPrefix = '+';
            counterpartyLabel = null;
            counterparty = null;
            counterpartyEmail = null;
        }
        
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="transaction-card ${cardClass}">
                <div class="tx-left">
                    <span class="tx-type">${escapeHtml(tx.type)}</span>
                    <span class="tx-desc">${escapeHtml(tx.description)}</span>
                    ${counterparty ? `<span class="tx-counterparty">${escapeHtml(counterpartyLabel)}: ${escapeHtml(counterparty)} [${escapeHtml(counterpartyEmail)}]</span>` : ''}
                </div>
                <div class="tx-right">
                    <span class="tx-amount">${amountPrefix}π${tx.amount}</span>
                    <div class="tx-date">${dateStr}</div>
                </div>
            </div>`;
        transactionList.appendChild(li);
        count++;
    });
}

document.getElementById('logoutBtn').addEventListener('click', async ()=>{
    await logout();
})