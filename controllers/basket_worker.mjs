import OrderItem from '../models/order.mjs';
import Table from '../models/table.mjs';

export async function getBasket (req, res) {
    const pageTitle = 'Basket';
    let submitButton;
    await Table.getTableStatus(req.session.worker.table, async (err, status) => {
      if(status[0].status == 'Not Ready'|| status[0].status == 'Standby' || status[0].status == 'Ready for service' ) {
        submitButton = 'Add items to the order';
      } else {
        submitButton = 'Submit the order';
      }
    });
    res.render('basket_worker', {pageTitle: pageTitle, items: req.session.worker.basket , submitButton: submitButton});
}
export async function addToBasket (req, res) {

  let item = req.body;
  item.id = parseInt(req.body.id); 
  item.quantity = parseInt(req.body.quantity);
  item.price = parseFloat(req.body.price)*item.quantity;
  req.session.worker.basket = req.session.worker.basket || [];
  
  const index = req.session.worker.basket.findIndex(element => element.id === item.id);
  if (index !== -1) { 
    req.session.worker.basket[index].quantity += item.quantity; 
    req.session.worker.basket[index].price += item.price;
  } else {
    req.session.worker.basket.push(item);
  }
  
  res.locals.numberOfBasketItems = req.session.worker.basket.length;
  res.redirect('/worker/menu');
}


export async function clearBasket (req, res) {
  req.session.worker.basket = [];
  res.sendStatus(200);
}


