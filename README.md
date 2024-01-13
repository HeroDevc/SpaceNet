# SpaceNet
Log information and retrieve it from an api!

## Endpoints
/messages?name=PLAYER&server=SERVER

/players?name=PLAYER&server=SERVER

## Usage
`node index.js`

## Database schema
```sql
CREATE DATABASE "spacenet";
```

```sql
CREATE TABLE messages (
    player TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    server TEXT NOT NULL
);
```
```sql
CREATE TABLE players (
    player TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    server TEXT NOT NULL
);
```

Note! This project is still in development and has bugs.
