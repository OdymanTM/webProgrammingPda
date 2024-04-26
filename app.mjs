// Express.js
import express from 'express'
// Handlebars (https://www.npmjs.com/package/express-handlebars)
import { engine } from 'express-handlebars'
const app = express()
const router = express.Router();
const port = process.env.PORT || '3000';

app.use(express.static('public'))

app.engine('hbs', engine({ extname: 'hbs' }));


app.set('view engine', 'hbs');

router.route('/').get(listAllTasksRender);





const server = app.listen(port, () => { console.log(`http://127.0.0.1:${port}`) });
