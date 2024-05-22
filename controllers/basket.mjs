import OrderItem from '../models/order.mjs';

export async function getBasket (req, res) {
    const pageTitle = 'Basket';
    res.render('basket', {layout: "main_customer", pageTitle: pageTitle, items: req.session.basket});
}
export async function addToBasket (req, res) {
  //{ id: '1', quantity: '1', comment: '' }
  let item = req.body;
  item.id = parseInt(req.body.id); 
  item.quantity = parseInt(req.body.quantity);
  item.price = parseFloat(req.body.price)*item.quantity;
  req.session.basket = req.session.basket || [];
  
  const index = req.session.basket.findIndex(element => element.id === item.id);
  if (index !== -1) { 
    req.session.basket[index].quantity += item.quantity; 
    req.session.basket[index].price += item.price;
  } else {
    req.session.basket.push(item);
  }
  res.locals.numberOfBasketItems = req.session.basket.length;
  res.redirect('/menu');
}


export async function clearBasket (req, res) {
  req.session.basket = [];
  res.sendStatus(200);
}


