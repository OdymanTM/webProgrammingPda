import sqlite3 from 'sqlite3';
sqlite3.verbose()
class Customer   {
    constructor(email ) {
        this.email = email;
    }

    getCustomersVisitCount() {
        'SELECT timesVisited FROM customer WHERE email = ?'
        return `${this.title} by ${this.author}, published in ${this.year}`;
    }
}