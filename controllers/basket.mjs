import OrderItem from '../models/order.mjs';

export async function getBasket (req, res) {
    const pageTitle = 'Basket';
    res.render('basket', {layout: "main_customer", pageTitle: pageTitle, items: req.cookies.basket});
}
export async function addToBasket (req, res) {
  //{ id: '1', quantity: '1', comment: '' }
  let item = req.body;
  item.id = parseInt(req.body.id); 
  item.quantity = parseInt(req.body.quantity);
  item.price = parseFloat(req.body.price)*item.quantity;
  req.cookies.basket = req.cookies.basket || [];
  
  const index = req.cookies.basket.findIndex(element => element.id === item.id);
  if (index !== -1) { 
    req.cookies.basket[index].quantity += item.quantity; 
    req.cookies.basket[index].price += item.price;
  } else {
    req.cookies.basket.push(item);
  }
  res.locals.numberOfBasketItems = req.cookies.basket.length;
  res.cookie('basket', req.cookies.basket, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: true });
  res.redirect('/menu');
}


export async function clearBasket (req, res) {
  res.cookie('basket', [], { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: true });
  res.sendStatus(200);
}


