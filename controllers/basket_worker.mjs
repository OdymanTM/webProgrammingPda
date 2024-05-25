import OrderItem from '../models/order.mjs';

export async function getBasket (req, res) {
    const pageTitle = 'Basket';
    res.render('basket_worker', {pageTitle: pageTitle, items: req.session.worker.basket});
}
export async function addToBasket (req, res) {
  //{ id: '1', quantity: '1', comment: '' }

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
  console.log(item);
  res.locals.numberOfBasketItems = req.session.worker.basket.length;
  res.redirect('/worker/menu');
}


export async function clearBasket (req, res) {
  req.session.worker.basket = [];
  res.sendStatus(200);
}


