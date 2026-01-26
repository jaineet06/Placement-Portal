import nodemailer from "nodemailer"

const tranporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

const sendMail = async ({ to, subject, body }) => {
    try {
        await tranporter.sendMail({
            from: '"Training & Placement Cell" <jaineetshah07@gmail.com>',
            to, subject, html: body
        })

    } catch (error) {
        console.log("Send Email Error: ", error.message);

    }
}

export default sendMail