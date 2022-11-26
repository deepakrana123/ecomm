const nodemailer =require("nodemailer");
exports.sendEmail = async (options)=>{

    const transporter=nodemailer.createTransport({
        host:"smtp@gmail.com",
        port:465,
        service:process.env.SMPT_SERVICES,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
    });
    const mailOptions = {
       from:process.env.SMPT_MAIL,
       to:options.email,
       subject:options.subject,
       text:options.message

    };

    await transporter.send(mailOptions)
} 