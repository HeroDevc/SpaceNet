const server = require('./src/lib/api/server');
const bot = require('./src/lib/minecraft/bot');
const config = require('./config.json');

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
};

let bots = [];

async function startApp () {
    new server.startApi(config["api"]["port"]);

    for (let i = 0; i < config["minecraft"]["servers"].length; i++) {
        bots.push(new bot.MinecraftBot(config["minecraft"]["username"], config["minecraft"]["servers"][i]["serverAddress"], config["minecraft"]["auth"], config["minecraft"]["servers"][i]["serverVersion"], config["minecraft"]["servers"][i]["serverName"]));
        await delay(6500); 
    } 
}

startApp();