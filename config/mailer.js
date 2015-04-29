var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'testvacation157@gmail.com',
        pass: 'vacationTEST157'
    }
});

module.exports = function(receivers, subject, text, html) {
    var mailOptions = {
        from: 'Отпуск <ops@katushka.net>', // sender address
        to: receivers, // list of receivers
        subject: subject, // Subject line
        text: text, // plaintext body
        html: html // html body
    };

    console.log(mailOptions);

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        } else{
            console.log('Message sent: ' + info.response);
        }
    });
};