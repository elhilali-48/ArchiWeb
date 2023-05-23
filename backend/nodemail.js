const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'elhilali.abdelouahab@gmail.com',
      pass: 'ctpswpvausvsbjsa'
    }
  });


module.exports = transporter