import request from 'request';
require('dotenv').config();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = 'https://bit.ly/3y5ykzP';

function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

let getUserName = (sender_psid) => {
    return new Promise ((resolve,reject) => {
        request({
            "uri" : `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "method" : "GET"
        }, (err,res,body) => {
            if(!err){
                console.log(body);
                body = JSON.parse(body);
                let username = `${body.first_name} ${body.last_name}`;
                resolve(username);
            }else{
                console.error("Unable to send message: "+err);
                reject(err)
            }
        })
    })
}

let handleGetStarted = (sender_psid) => {
    return new Promise (async (resolve,reject) => {
        try{
            let username = await getUserName(sender_psid);
            let response1 = { "text" : `Chào mừng bạn ${username} đến với P-Covid` }

            let response2 = getStartedTemplate();

            //send text message
            await callSendAPI(sender_psid, response1);

            //send generic template message

            await callSendAPI(sender_psid, response2);
            resolve('Done');
        }catch{
            reject('Error');
        }
    })
}

let getStartedTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Xin chào bạn đến với P-Covid",
                    "subtitle": "Dưới đây là các dịch vụ của P-Covid",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Chi tiết bác sĩ",    
                            "payload": "DOCTOR_DETAIL",
                        },
                        {
                            "type": "postback",
                            "title": "Đặt lịch hẹn",    
                            "payload": "MAKE_APPOINTMENT",
                        },
                        {
                            "type": "postback",
                            "title": "Hướng dẫn sử dụng bot",
                            "payload": "GUIDE_TO_USE_BOT",
                        }
                    ],
                }]
            }
        }
    }
    console.log(response);
    return response;
}

let handleDetailDoctor = (sender_psid) => {
    return new Promise (async (resolve,reject) => {
        try{
            let response1 = getDetailDoctorTemplate();

            //send text message
            await callSendAPI(sender_psid, response1);

            resolve('Done');
        }catch{
            reject('Error');
        }
    })
}

let getDetailDoctorTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                {
                    "title": "Bác sĩ A",
                    "subtitle": "Description A",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Đặt lịch hẹn",    
                            "payload": "MAKE_APPOINTMENT",
                        }
                    ],
                },
                {
                    "title": "Bác sĩ B",
                    "subtitle": "Description B",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Đặt lịch hẹn",
                            "payload": "MAKE_APPOINTMENT",
                        }
                    ]
                },
                {
                    "title": "Bác sĩ C",
                    "subtitle": "Description C",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Đặt lịch hẹn",
                            "payload": "MAKE_APPOINTMENT",
                        }
                    ]
                }
                ]
            }
        }
    }
}

module.exports = {
    handleGetStarted: handleGetStarted,
    handleDetailDoctor: handleDetailDoctor
}