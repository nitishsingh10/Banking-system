// all the authentication job will be passed from here

/*  
    All the core authentication APIs are written here,

    these functions will be called from the respective functions of the
    features present in the pages folder.

    Here the main central API method will be called by sending the necessary fields
*/

// for registeration
async function register(name,email,password,phone,address){ // this will be called from register.js

    return request('/auth/signup',{ // over here we have called requesr method of API.js and directly returning the data returned by the backend
        method: 'POST',
        body: JSON.stringify({name,email,password,phone,address}) // sending necessaryu fields
    });

}

// the above process is happening for all the api calls

//for otpVerification
async function verifyOtp(otp,email){

    return request('/auth/otp',{
        method: 'POST',
        body: JSON.stringify({otp,email})
    });

}

// for login

async function login(email,password){
    
    return request('/auth/login',{
        method : 'POST',
        body : JSON.stringify({email,password})
    });
}

// for logout
// clears the cookie on server, clears localStorage on user side
async function logout(){

    await request('/auth/logout',{ // request sent to clear cookie from server
        method : 'POST',
    })

    localStorage.clear(); // clears the cookie from the local storage
    window.location.href = '/login.html' 
}