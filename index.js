// obs-websocket-js by Brendan Hagan
// Copyright (c) 2016 Brendan Hagan
// Licensed under MIT (https://github.com/obs-websocket-community-projects/obs-websocket-js/blob/master/LICENSE.md)

// youtube-chat by LinaTsukusu
// Copyright (c) 2021 LinaTsukusu
// Licensed under MIT (https://github.com/LinaTsukusu/youtube-chat/blob/develop/LICENSE)

const { LiveChat } = require("youtube-chat")

const obs = new OBSWebSocket();

var liveChat, yoyakuword, keshiword, liveid, list, eibox, yoyakuretsu;
var address, pass, sourcename;
var is_connected = false;
var sankasya = new Array();
list = document.getElementById('list');
eibox = document.getElementById('enable_input');

function yoyakustart() {
    yoyakuword = document.getElementById('yoyakuword').value;
    keshiword = document.getElementById('keshiword').value;
    liveid = document.getElementById('liveid').value;
    liveChat = null;
    sankasya = [];
    yoyakuretsu = ""
    list.value = "";
    liveChat = new LiveChat({ liveId: liveid });
    liveChat.start();

    liveChat.on("chat", (chatItem) => {
        if (chatItem.message[0].text === yoyakuword) {
            sankasya.push(chatItem.author.name);
            yoyakuretsu = sankasya.toString().replace(/,/g, "\n");
            list.value = yoyakuretsu;
            if (is_connected === true) {
                obs.send('SetTextFreetype2Properties', {
                    'source': sourcename,
                    'text': yoyakuretsu
                })
            }
        }
        if (chatItem.message[0].text === keshiword) {
            sankasya.splice(sankasya.indexOf(chatItem.author.name), 1);
            yoyakuretsu = sankasya.toString().replace(/,/g, "\n");
            list.value = yoyakuretsu;
            if (is_connected === true) {
                obs.send('SetTextFreetype2Properties', {
                    'source': sourcename,
                    'text': yoyakuretsu
                })
            }
        }
    })

    liveChat.on("start", (liveId) => {
        document.getElementById('status').textContent = "状態：稼働中";
    })

    liveChat.on("end", (reason) => {
        document.getElementById('status').textContent = "状態：停止中";
    })

    liveChat.on("error", (err) => {
        document.getElementById('status').textContent = "状態：エラー";
    })
}

function yoyakustop() {
    liveChat.stop();
}

eibox.addEventListener('change', function() {

    if (eibox.checked == true) {
        list.readOnly = false;
    } else {
        list.readOnly = true;
        yoyakuretsu = list.value;
        sankasya = yoyakuretsu.split('\n')
        if (is_connected == true) {
            obs.send('SetTextFreetype2Properties', {
                'source': sourcename,
                'text': yoyakuretsu
            })
        }
    }
}, false)

function obsstart() {
    address = document.getElementById('address').value;
    pass = document.getElementById('pass').value;
    sourcename = document.getElementById('sourcename').value;
    obs.connect({
            address: 'localhost:' + address,
            password: pass
        })
        .then(() => {
            is_connected = true;
            document.getElementById('statobs').textContent = "状態：接続中";
        })

    obs.on('error', err => {
        document.getElementById('statobs').textContent = "状態：エラー";
    });
}

function obsstop() {
    obs.disconnect()
    is_connected = false;
    document.getElementById('statobs').textContent = "状態：接続解除中";
}