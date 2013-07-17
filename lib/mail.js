var nodemailer = require("nodemailer"),
    config = require('../config'),
    sender = config.sys().feedback;

exports.send = function(mailcontent,cb) {
  
  var smtpTransport = nodemailer.createTransport("SMTP", {
    host: sender.server,
    port: sender.port,
    use_authentication: sender.useAuth,
    auth: {
      user: sender.email,
      pass: sender.password
    }
  });

  var mailOptions = {
    from: sender.from,
    to: sender.to,
    subject: sender.title,
    text: mailcontent
  }

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if(error) {
      console.log(error);
      cb('error');
    } else {
      cb(response);
    }
    smtpTransport.close();
  });

}
