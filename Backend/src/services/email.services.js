const transporter = require('../config/email');

const sendEmail = async ({to,subject,amount,type})=>{
    
    // dummy boiler plate for further additions

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        body : `type : ${type}, amount : ${amount}`
    }

}