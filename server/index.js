const path = require("path");
const express = require("express");
const transporter = require("./config");
const dotenv = require("dotenv");
dotenv.config();

// handle API requests
const app = express();

const buildPath = path.join(__dirname, "..", "build");

// set up parser -> handle form data (from POST request)
app.use(express.json());

// serve all files from "build" folder
app.use(express.static(buildPath));

// POST request handler for "/send" endpoint
app.post("/send", (req, res) => {
  try {
    const mailOptions = {
      from: req.body.email, // sender address
      to: process.env.email, // list of receivers
      subject: req.body.subject, // Subject line
      html: req.body.message, // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Something went wrong. Try again later",
        });
      } else {
        res.send({
          success: true,
          message: "Thanks for contacting us. We will get back to you shortly",
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong. Try again later",
    });
  }
});

// start express server -> listen to API requests on port
app.listen(3030, () => {
  console.log("server start on port 3030");
});
