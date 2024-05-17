import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import path from 'path';
import * as menuController from './controllers/menu_customer.mjs';
import menuItem  from './models/menuItem.mjs';
import { fileURLToPath } from 'url';
import e from 'express';
import { get } from 'http';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(session({
  secret:"omada22",
  resave:false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const port = process.env.PORT || '3000';
app.listen(port,'0.0.0.0', () => { console.log(`http://Localhost:${port}`) });

app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts'}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

import routes from './routes/routes.mjs';
app.use('/', routes);
