var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '*****',
        pass: '*****'
    }
});

//var mailOptions = {
//    from: 'Fred Foo ✔ <ops@katushka.net>', // sender address
//    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
//    subject: 'Hello ✔', // Subject line
//    text: 'Hello world ✔', // plaintext body
//    html: '<b>Hello world ✔</b>' // html body
//};
//
//transporter.sendMail(mailOptions, function(error, info){
//    if(error){
//        console.log(error);
//    }else{
//        console.log('Message sent: ' + info.response);
//    }
//});

//Типы писем:
//    - Пользователь/Менеджер оставил заявку
//    - Менеджер одобрил/отклонил заявку
//    - Администратор подтвердил/отменил заявку