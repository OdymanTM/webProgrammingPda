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

const sectors = 
{
    "sectors":[
      {
        "sector": "Sector 1",
        "chosen": "true"
      },
      {
        "sector": "Sector 2"
      },
      {
        "sector": "Garden"
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


export async function posts(req, res){

    try{
        pageTitle = 'Posts';
        res.render('posts', { pageTitle: pageTitle});
    }
    catch(err){
        res.send(err);
    }
}

export async function menuInit(req, res){

    try{
        pageTitle = 'Menu';
        res.render('menu', { pageTitle: pageTitle, menuCats: menuCats.categories, chosenCat: 'Beverages', items: menuData.items });
    }
    catch(err){
        res.send(err);
    }
}

export async function menuCategory(req, res){

    try{
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
    }

    catch(err){
        res.send(err);
    }
}

export async function ordersHistoryInit(req,res){

    try{
        pageTitle = 'Orders History';
        res.render('orders_history', { pageTitle: pageTitle, orders: ordersHistory.orders});
    }
    catch(err){
        res.send(err);
    }
}

export async function tablesInit(req,res){

    try{
        pageTitle = 'Tables';
        res.render('tables', {pageTitle: pageTitle, sectors: sectors.sectors, chosenSector: 'Sector 1', tables: tables.tables});
    }
    catch(err){
        res.send(err);
    }
}

export async function tablesSector(req,res){

    try{
        pageTitle = 'Tables';
        const prevChosenSector = sectors.sectors.find(cat => cat.chosen);
        if (prevChosenSector) {
            delete prevChosenSector.chosen;
        }
        const chosenSector = sectors.sectors.find(cat => cat.sector === req.params.sector);
        if (chosenSector) {
            chosenSector.chosen = true;
        }  
  
        res.render('tables', { pageTitle: pageTitle, sectors: sectors.sectors, chosenSector: req.params.sector, tables: tables.tables });
    }
    catch(err){
        res.send(err);
    }
}
