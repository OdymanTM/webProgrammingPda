
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
  //console.log(item);
  //console.log(req.session);
  res.redirect('/menu');}

