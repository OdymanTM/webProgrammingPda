import OrderItem from '../models/order.mjs';
import Table from '../models/table.mjs';

export async function getBasket (req, res) {
    const pageTitle = 'Basket';
    let submitButton;
    await Table.getTableStatus(req.cookies.worker_table, async (err, status) => {
      console.log(status);
      if(status == null || !status[0]){
        submitButton = 'Submit the order';
      }
      else if(status[0].status == 'Not Ready'|| status[0].status == 'Standby' || status[0].status == 'Ready for service' ) {
        submitButton = 'Add items to the order';
      } else {
        submitButton = 'Submit the order';
      }
    });
    res.render('basket_worker', {pageTitle: pageTitle, items: req.cookies.worker_basket , submitButton: submitButton});
}
export async function addToBasket (req, res) {

  let item = req.body;
  item.id = parseInt(req.body.id); 
  item.quantity = parseInt(req.body.quantity);
  item.price = parseFloat(req.body.price)*item.quantity;
  req.cookies.worker_basket = req.cookies.worker_basket || [];
  
  const index = req.cookies.worker_basket.findIndex(element => element.id === item.id);
  if (index !== -1) { 
    req.cookies.worker_basket[index].quantity += item.quantity; 
    req.cookies.worker_basket[index].price += item.price;
  } else {
    req.cookies.worker_basket.push(item);
  }
  
  res.locals.numberOfBasketItems = req.cookies.worker_basket.length;
  res.cookie('worker_basket', req.cookies.worker_basket, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: true });
  res.redirect('/worker/menu');
}


export async function clearBasket (req, res) {
  res.cookie('worker_basket', [], { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: true });
  res.sendStatus(200);
}


