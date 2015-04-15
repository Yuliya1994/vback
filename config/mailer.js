var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'testvacation157@gmail.com',
        pass: 'vacationTEST157'
    }
});

//var mailOptions = {
//    from: 'Fred Foo ✔ <ops@katushka.net>', // sender address
//    to: 'ops@katushka.net', // list of receivers
//    subject: 'Hello ✔', // Subject line
//    text: 'Hello world ✔', // plaintext body
//    html: '<b>Hello world ✔</b>' // html body
//};


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

//Типы писем:
//    - Пользователь/Менеджер оставил заявку
//    - Менеджер одобрил/отклонил заявку
//    - Администратор подтвердил/отменил заявку