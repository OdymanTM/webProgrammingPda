import express from 'express';
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
const port = process.env.PORT || '3000';
app.listen(port,'0.0.0.0', () => { console.log(`http://Localhost:${port}`) });

app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts'}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
/*
const ordersHistory = {
    "orders": [
      {
        "price": "17.70€",
        "table": "Table 4",
        "date": "08 April 2023",
      },
      {
        "price": "35.70€",
        "table": "Table 2",
        "date": "19 May 2023",
      },
      {
        "price": "25.70€",
        "table": "Table 1",
        "date": "19 July 2023",
      },
      {
        "price": "19.30€",
        "table": "Table 4",
        "date": "Today",
        "status": "paid!"
      },
      {
        "price": "22.50€",
        "table": "Table 3",
        "date": "Today",
        "status": "not paid!"
      }
    ]
}

const tables = {
  "tables": [
    {"table": "Table 1",
    "status": "free"
    },
    {
      "table": "Table 2",
      "status": "not served",
      "extraInfo": "order time: 21:43"
    },
    {
      "table": "Table 3",
      "status": "served",
      "extraInfo": "not paid"
    },
    {
      "table": "Table 4",
      "status": "served",
      "extraInfo": "paid"
    },
    {
      "table": "Table 5",
      "status": "not ordered",
      "placeholderText": "arrival time: 22:03"
    }
  ]
}
*/
import routes from './routes/routes.mjs';
app.use('/', routes);
/*
app.get('/', (req,res) => {
  res.render('posts', { pageTitle: pageTitle});
});

app.get('/menu',async (req,res) => {
  await menuController.getMenu(req, res);
  });

app.get('/menu/:category',async (req,res) => {
  await menuController.getOneCategory(req, res);
});

app.get('/orders_history', (req, res) => {
  pageTitle = 'Orders History';
  res.render('orders_history', { pageTitle: pageTitle, orders: ordersHistory.orders});
});

app.get('/tables', (req,res) => {
  pageTitle = 'Tables';
  res.render('tables', {pageTitle: pageTitle, tables: tables.tables});
});

*/