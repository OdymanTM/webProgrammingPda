import sqlite3 from 'sqlite3';
sqlite3.verbose()

const { Database, OPEN_READWRITE } = sqlite3;
const db = new Database('./database/db.db', OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database connected!');
    }
});

db.on();
