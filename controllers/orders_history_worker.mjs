import OrderItem from "../models/order.mjs";


async function getOrdersHistory (req, res) {
  let pageTitle = 'Orders History';
  OrderItem.getAllOrdersLimit100((err, orders) => {
    res.render('orders_history_customer', {layout: 'main' ,pageTitle: pageTitle, orders: orders});
  });
}

export { getOrdersHistory };