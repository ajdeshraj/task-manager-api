require('dotenv').config()
const sgMail = require('@sendgrid/mail')

console.log(process.env.EMAIL_API_KEY)

sgMail.setApiKey(process.env.EMAIL_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'arjun.deshraj@gmail.com',
        subject: 'Thanks for Signing Up',
        text: `Welcome to the Task Manager Application, ${name}! Let us know how you're getting on with the web-app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'arjun.deshraj@gmail.com',
        subject: 'Account Cancellation',
        text: `Goodbye ${name}! We're sorry to see you go. Let us know why you've chosen to cancel your account and what we could to help improve the overall user experience.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
