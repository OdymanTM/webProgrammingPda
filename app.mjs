import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import session from 'express-session';

import menuItem  from './models/menuItem.mjs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || '3000';
app.listen(port,'0.0.0.0', () => { console.log(`http://Localhost:${port}`) });

app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts'}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

/*
const redirectHome = (req, res, next) => {
  console.log('redirect...', req.session)
  redirect('/');
}
*/

import routes from './routes/routes.mjs';
app.use('/', routes);

  res.render('tables', {pageTitle: pageTitle, tables: tables.tables});
});

