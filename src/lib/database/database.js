const { Pool } = require('pg');
const config = require('../../../config.json');

const pool = new Pool({
    user: config["database"]["user"],
    host: config["database"]["host"],
    database: config["database"]["database"],
    password: config["database"]["password"],
    port: config["database"]["port"],
    max: config["database"]["max"],
    connectionTimeoutMillis: config["database"]["connectionTimeoutMillis"],
    idleTimeoutMillis: config["database"]["idleTimeoutMillis"],
    allowExitOnIdle: config["database"]["allowExitOnIdle"]
});

process.on('exit', () => {
    pool.end();
});

async function saveMessage(player, message, timestamp, server) {
    const client = await pool.connect();

    try {
        await client.query(`INSERT INTO messages (player, message, timestamp, server) VALUES ($1, $2, $3, $4)`, [player, message, timestamp, server]);
    } catch (err) {
        console.log(err);
        return;
    } finally {
        client.release();
    }
}

async function getMessage(player, server) {
    const client = await pool.connect();

    try {
        const res = await client.query(`SELECT message, timestamp FROM messages WHERE LOWER(player) = LOWER($1) AND LOWER(server) = LOWER($2)`, [player, server]);
        return res.rows.length > 0 ? res.rows : null;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        client.release();
    }
}

async function savePlayer(player, timestamp, server) {
    const client = await pool.connect();

    try {
        const res = await client.query(`SELECT player FROM players WHERE player = $1 AND server = $2`, [player, server]);

        if (res.rows.length > 0) {
            await client.query(`UPDATE players SET timestamp = $1 WHERE player = $2 AND server = $3`, [timestamp, player, server]);
        } else {
            await client.query(`INSERT INTO players (player, timestamp, server) VALUES ($1, $2, $3)`, [player, timestamp, server]);
        }
    } catch (err) {
        console.log(err);
        return;
    } finally {
        client.release();
    }
};

async function getPlayer(player, server) {
    const client = await pool.connect();

    try {
        const res = await client.query(`SELECT timestamp FROM players WHERE LOWER(player) = LOWER($1) AND LOWER(server) = LOWER($2)`, [player, server]);
        return res.rows.length > 0 ? res.rows[0].timestamp : null;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        client.release();
    }
};

module.exports = { saveMessage, getMessage, savePlayer, getPlayer };