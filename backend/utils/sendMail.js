// const nodemailer = require("nodemailer");

// const sendMail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMPT_HOST,
//         port: process.env.SMPT_PORT,
//         service: process.env.SMPT_SERVICE,
//         auth:{
//             user: process.env.SMPT_MAIL,
//             pass: process.env.SMPT_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: process.env.SMPT_MAIL,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//     };

//     await transporter.sendMail(mailOptions);
// };

// module.exports = sendMail;


const nodemailer = require('nodemailer');

// Nodemailer
const sendMail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // or 465 if secure
    secure: false, 
    auth: {
      user: "khgamal005@gmail.com",
      pass:"tmjy gxcf ecep yjql",
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: 'Easyshop App <khgamal005@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendMail;


