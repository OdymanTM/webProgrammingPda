import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import session from 'express-session';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || '3000';
app.listen(port, () => { console.log(`http://127.0.0.1:${port}`) });

app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts'}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

const menuData = 
{
    "items": [
      {
        "name": "Mojito",
        "description": "white rum, soda water, mint",
        "price": "7.0€"
      },
      {
        "name": "Bloody Mary",
        "description": "vodka, tomato juice, lemon",
        "price": "7.5€"
      },
      {
        "name": "Old Fashioned",
        "description": "rye whiskey, angostura bitter",
        "price": "8.0€"
      }
    ]
}

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
/*
const redirectHome = (req, res, next) => {
  console.log('redirect...', req.session)
  redirect('/');
}
*/

app.get('/', (req,res) => {
  res.render('posts');
});

app.get('/menu', (req,res) => {
  res.render('menu', { items: menuData.items });
});

app.get('/orders_history', (req, res) => {
  res.render('orders_history', { orders: ordersHistory.orders});
});

app.get('/tables', (req,res) => {
  res.render('tables');
});

