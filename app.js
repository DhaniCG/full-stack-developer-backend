import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import serverless from "serverless-http";
import nodemailer from "nodemailer"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// export const handler = serverless(app);

const transporter = nodemailer.createTransport({
    name: process.env.EMAIL_HOST,
    host: process.env.EMAIL_HOST,
    port: 465,
    auth: {
        user: "dhani@dhanidesigns.com",
        pass: process.env.PASSWORD,
    },
    tls:{
        rejectunauthorized: false
    }
});

const sendEmail = async (title, message) => {
    const mailOptions = {
        from: 'dhani@dhanidesigns.com',
        to: 'dhanigamer777@gmail.com',
        subject: title,
        html: message,
      };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (err) {
        console.log(`Error sending email: ${err}`);
    }
}

app.get("/", (req, res) => {
    transporter.verify((error, success) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    sendEmail("title", "details");
    res.sendStatus(200);
})

app.post("/form-submission", (req, res) => {
    const { name, email, services, budget, projectSize, rate, projectTitle, projectDescription } = req.body;

    const title = `New Project: ${projectTitle}`;
    const details = `
        <p>Full Name: <strong>${name}</strong></p>
        <p>Email: <strong>${email}</strong></p>
        <p>Services: <strong>${services}</strong></p>
        <p>Budget: <strong>${budget}</strong></p>
        <p>Project Size: <strong>${projectSize}</strong></p>
        <p>Rate: <strong>${rate}</strong></p><br />
        <h3>${projectTitle}</h3>
        <p>${projectDescription}</p>
    `;

    try {
        sendEmail(title, details);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.send(err);
    }
})

app.get("/failed-submission", (req, res) => {
    const title = "Uh Oh, Form Submission error";
    const detail = "<h3>Something is wrong when someone submitting their form, go ahead and check what's going on with the code!</h3>";

    try {
        sendEmail(title, detail);
        res.send("Problem has been reported");
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

app.listen(port, console.log(`Started on port ${port}`));