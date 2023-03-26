import nodemailer from "nodemailer";

const sendEmail = async (option) => {

    const transporter = nodemailer.createTransport({

        host: "1.2.3.4",
        port: 465,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        },
    })

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(mailOptions);
}

export default sendEmail;