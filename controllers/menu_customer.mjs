import menuItem from '../models/menuItem.mjs';

async function getMenu (req, res) {
    const pageTitle = 'Menu';
    await menuItem.getAllMenuItems(async (err, items) => {
      await menuItem.getAvailableCategories((err, categories) => {
      if (err) {
          console.log(err);
        res.status(500).send('Error reading menu items');
      } else {
          const groupedItems = items.reduce((acc, item) => {
              // Initialize the category array if it doesn't already exist
              if (!acc[item.category]) {
                  acc[item.category] = [];
              }
              // Push the item to the category array
              acc[item.category].push(item);
              return acc;
          }, {});
        res.render('menu', {layout: "main_customer", pageTitle: pageTitle, menuCats: categories, items: groupedItems });
      }
      });
  })
}

async function getOneCategory (req, res) {
    const pageTitle = 'Menu';
    await menuItem.getMenuItemsByCategory(req.params.category ,async (err, items) => {
    await menuItem.getAvailableCategories((err, categories) => {
    if (err) {
        console.log(err);
      res.status(500).send('Error reading menu items');
    } else {
        const groupedItems = items.reduce((acc, item) => {
            // Initialize the category array if it doesn't already exist
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            // Push the item to the category array
            acc[item.category].push(item);
            return acc;
        }, {});
        for(let cat of categories) {
            if (cat.category == req.params.category) {
                cat.chosen = true;
            }
        }
      res.render('menu', {layout: "main_customer", pageTitle: pageTitle, menuCats: categories, items: groupedItems });
    }
    });
  })
}

export { getMenu, getOneCategory };
