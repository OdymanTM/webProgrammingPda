import OrderItem from '../models/order.mjs';

async function getOrdersHistory (req, res) {
    let pageTitle = 'Orders History';
    OrderItem.getOrdersOfCustomer('palamaris02@gmail.com', (err, orders) => {
      res.render('orders_history_customer', {layout: 'main_customer' ,pageTitle: pageTitle, orders: orders});
    });
}

export { getOrdersHistory }