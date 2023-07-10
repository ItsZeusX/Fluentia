var nodemailer = require("nodemailer");

function sendEmail(receiver, subject, text) {
  let support_email = "supmti.fluentia@outlook.com";
  var transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: support_email,
      pass: "f38997a3d1",
    },
  });

  var mailOptions = {
    from: support_email,
    to: receiver,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendEmail;
