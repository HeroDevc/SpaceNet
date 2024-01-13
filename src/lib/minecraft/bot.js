const mineflayer = require('mineflayer');
const database = require('../database/database');
const config = require('../../../config.json');

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
};

class MinecraftBot {
    constructor(username, host, auth, version, server) {
        this.username = username;
        this.host = host;
        this.version = version;
        this.auth = auth || 'offline';
        this.server = server

        this.initBot();
    }

    initBot() {
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "version": this.version,
            "auth": this.auth
        });

        this.initEvents()
    }

    initEvents() {
        this.bot.on('login', () => {
            let botSocket = this.bot._client.socket;
            console.log(`[${this.username}] Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`);
        });

        this.bot.on('end', (reason) => {
            console.log(`Disconnected: ${reason}`);

            setTimeout(() => this.initBot(), config["minecraft"]["autoReconnectDelay"]);
        });

        this.bot.on('kicked', (reason) => {
            console.log(`Kicked: ${reason}`);
        });

        this.bot.on('error', (err) => {
            console.log(`Error: ${err}`);
        });

        this.bot.on('chat', async (username, jsonMsg) => {
            const timestamp = new Date().toUTCString();

            await database.saveMessage(username, jsonMsg, timestamp, this.server);
        });

        this.bot.on('playerJoined', async (player) => {
            const timestamp = new Date().toUTCString();

            await database.savePlayer(player.username, timestamp, this.server);
        });

        this.bot.on('playerLeft', async (player) => {
            const timestamp = new Date().toUTCString();
            
            await database.savePlayer(player.username, timestamp, this.server);
        });

        this.bot.once('spawn', () => {
            if (config["minecraft"]["antiAFK"] == true) {
                setInterval(() => {
                    this.bot.swingArm('left');
                }, 25 * 1000);
            }
        });

        this.bot.on('messagestr', (jsonMsg) => {
            console.log(jsonMsg);
        });
    }
};

module.exports = { MinecraftBot };