const express = require('express');
const router = express.Router();
const database = require('../../database/database');

router.get('/', async (req, res) => {
    const { name, server } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'No name provided!' });
    }

    if (!server) {
        return res.status(400).json({ message: 'No server provided!' });
    }

    try {
        const query = await database.getMessage(name, server);

        const resp = {
            player: name,
            messages: query.map(message => ({
                message: message.message,
                timestamp: message.timestamp
            }))
        };

        return res.status(200).json(resp);
    } catch (error) {
        console.log(error);

        return res.status(404).json({ message: 'Found nothing.' });
    }
});

module.exports = router;