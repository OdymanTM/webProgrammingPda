import pg from 'pg';
class Customer   {
    constructor(email ) {
        this.email = email;
    }

    getCustomersVisitCount(email, callback) {
        const query = 'SELECT timesVisited FROM customer WHERE email = ?'
        return new Promise((resolve, reject) => {
            this.db.run(query, [email], function (err, rows) {
                if (err) {
                    reject(callback(err, null));
                } else {
                    resolve(callback(null, rows));
                }
            });
        });
    }
}
