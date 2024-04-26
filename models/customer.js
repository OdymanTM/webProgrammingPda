import sqlite3 from 'sqlite3';
sqlite3.verbose()
class Customer   {
    constructor(email ) {
        this.email = email;
    }

    getCustomersVisitCount(email, callback) {
        const query = 'SELECT timesVisited FROM customer WHERE email = ?'
        return new Promise((resolve, reject) => {
            this.db.run(query, [email], function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(callback(row));
                }
            });
        });
    }
}
