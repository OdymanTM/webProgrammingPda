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
  item.price = parseFloat(req.body.price);
  req.session.basket = req.session.basket || []; 
  req.session.basket.push(item);
  res.redirect('/menu');}
  

export async function sendOrder (req, res) {
  let items = req.session.basket;
  let email = req.session.passport.user;
  OrderItem.addOrder(user, order, (err, ress) => {
    if (err) {
      console.log(err);
    } else {
      req.session.basket = [];
      res.redirect('/menu');
    }
  });
}

