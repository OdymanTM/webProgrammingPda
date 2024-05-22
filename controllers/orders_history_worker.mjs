import OrderItem from "../models/order.mjs";


async function getOrdersHistory(req,res){
    await OrderItem .getNotActiveOrders((err, orders) => {
      const pageTitle = 'Orders History';
      res.render('orders_history', { layout: "main", pageTitle: pageTitle, orders: orders});
    });
}

export { getOrdersHistory };