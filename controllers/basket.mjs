
async function getBasket (req, res) {
    const pageTitle = 'Basket';
      res.render('basket', {layout: "main_customer", pageTitle: pageTitle, items: req.session.basket});
}



export { getBasket };
