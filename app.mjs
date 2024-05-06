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
app.listen(port,'0.0.0.0', () => { console.log(`http://0.0.0.0:${port}`) });

app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts'}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

let pageTitle;

const menuCats = 
{
    "categories": [
      {
        "category" :"Beverages",
        "chosen": "true"
      },
      {
        "category" :"Brunch"
      },
      {
        "category" :"Drinks"
      },
      {
        "category" :"Coffee"
      },
      {
        "category" :"Salads"
      }
    ]
}

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

/*
const redirectHome = (req, res, next) => {
  console.log('redirect...', req.session)
  redirect('/');
}
*/

app.get('/', (req,res) => {
  pageTitle = 'Posts';
  res.render('posts', { pageTitle: pageTitle});
});

app.get('/menu', (req,res) => {
  pageTitle = 'Menu';
  res.render('menu', { pageTitle: pageTitle, menuCats: menuCats.categories, chosenCat: 'Beverages', items: menuData.items });
});

app.get('/menu/:category', (req,res) => {
  
  pageTitle = 'Menu';
  
  const prevChosenCategory = menuCats.categories.find(cat => cat.chosen);
  if (prevChosenCategory) {
      delete prevChosenCategory.chosen;
  }
  const chosenCategory = menuCats.categories.find(cat => cat.category === req.params.category);
  if (chosenCategory) {
      chosenCategory.chosen = true;
  }

  res.render('menu', { pageTitle: pageTitle, menuCats: menuCats.categories, chosenCat: req.params.category, items: menuData.items });
});

app.get('/orders_history', (req, res) => {
  pageTitle = 'Orders History';
  res.render('orders_history', { pageTitle: pageTitle, orders: ordersHistory.orders});
});

app.get('/tables', (req,res) => {
  pageTitle = 'Tables';
  res.render('tables', {pageTitle: pageTitle, tables: tables.tables});
});

