import OrderItem from '../models/order.mjs';

async function getOrdersHistory (req, res) {
    let pageTitle = 'Orders History';
    let user = req.session.passport ? req.session.passport.user :'default';
    OrderItem.getOrdersOfCustomer(user, (err, orders) => {
      res.render('orders_history_customer', {layout: 'main_customer' ,pageTitle: pageTitle, orders: orders});
    });
}

export { getOrdersHistory }