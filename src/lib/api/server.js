const express = require('express');
const app = express();

app.use(express.json());

const messagesRoute = require('./routes/messages');
app.use('/messages', messagesRoute);

const playersRoute = require('./routes/players');
app.use('/players', playersRoute);

class startApi {
    constructor(port) {
        this.port = port;

        this.initAPI();
    }

    initAPI() {
        app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        });
    }
}

module.exports = { startApi };
