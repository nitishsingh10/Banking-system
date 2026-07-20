let email = sessionStorage.getItem('userEmail');
const errMsg = document.getElementById('errorMsg');
document.getElementById('submitBtn').addEventListener('click',async ()=>{
    const name = document.getElementById('userName').value.trim() || 'Anonymous';
    const star = document.querySelector("input[name='rating']:checked")?.value;
    const comment = document.getElementById('commentBlock').value.trim();

    if(!star || !comment){

        errMsg.style.display = 'block'
        errMsg.innerText = 'Please rate and comment!'
        return;
    }

    const userRating = {email,name,star,comment}
    const res = await rate(userRating);

    if(res && res.success){
        document.querySelector('body').innerHTML = `<div id="transactionModal" style="display : block">
            <div class="modalContent" id="modalContent">
                <h3 class="mb-3">Thank You for your response 😊</h3>
                <button id="closeModalBtn" class="btn-secondary mt-3" style="width: 100%;"><i class="bi bi-x-circle"></i>
                    Close</button>
            </div>
        </div>`

        document.getElementById('closeModalBtn').addEventListener('click',()=>{
            window.location.href = './dashboard.html'
        })
    }
    else{
        errMsg.style.display = 'block'
        errMsg.innerHTML = res.data.message;
    }
    
});