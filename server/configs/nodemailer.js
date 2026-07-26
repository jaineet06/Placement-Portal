import nodemailer from "nodemailer"

const tranporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure:Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

const sendMail = async ({ to, subject, body }) => {
    try {
        await tranporter.sendMail({
            from: `"Placement Portal" <${process.env.SMTP_SENDER}>`,
            to, subject, html: body
        })

    } catch (error) {
        console.log(error);
        throw error
    }
}

export default sendMail