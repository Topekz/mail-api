const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(bodyParser.json())
app.use(morgan("combined"));
const origin = process.env.ORIGIN;      // allowed ORIGIN from .env.(development/production).local
app.use(cors({credentials: true, origin: origin}));
console.log(("Allowing: " + origin));

const port = process.env.PORT;          // PORT from .env.(development/production).local

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",             // gmail by default
    secure: true,                       // true for 465, false for other ports
    auth: {
        user: process.env.USER,         // USER from .env.(development/production).local
        pass: process.env.PASS,         // PASS from .env.(development/production).local
    }
});

// Default GET
app.get('/', (req, res) => {
    res.send({ message: "mail-api is running" });
});

// POST request
app.post('/', (req, res) => {

    const receiver = req.body.receiver;
    const subject = req.body.name + " contacted";
    const message = "<h1>Message from contact form</h1><p>Name: " + req.body.name + "</p><p>Email: " + req.body.email + "</p><br><p>" + req.body.message + "</p>";

    // mail data
    const mail = {
        from: process.env.USER,
        to: receiver,
        subject: subject,
        html: message
    };

    // send mail
    transporter.sendMail(mail, function (error, info) {
        if(error) {
            console.log(error);
            return res.send({ message: "Error: " + error.code });
        } else {
            console.log(info);
            return res.status(200).send({ message: "Message sent" });
        }
     });
});

//Listen to the port
app.listen(port, () => console.log(`Listening at ${port}`));