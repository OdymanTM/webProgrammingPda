import { cp, rmSync } from 'fs';
import table from '../models/table.mjs';
import order from '../models/order.mjs';
import util from 'util';
import e from 'express';


export async function getTables(req, res){
    const pageTitle = 'Tables';
    await table.getTablesStatuses((err, tables) => {
            if (err){
                console.log(err);
                res.status(500).send('Error finding tables');
            }
            else{
                const groupedTables = tables.reduce((acc, tab) => {
                    if (!acc[tab.tablelocation]){
                        acc[tab.tablelocation] = [];
                    }
                    if (tab.status === null){
                        tab.status = 'Free';
                    }
                    if (tab.status === 'Free' || tab.status === 'Paid' || tab.status === 'Cancelled'){
                        tab.isAvailable = true;
                    }
                    if (tab.status === 'Standby' || tab.status === 'Ready for service' || tab.status === 'Not Ready'){
                        tab.addToOrder = true;
                    }
                    acc[tab.tablelocation].push(tab);
                    return acc;
                }, {});
                //get sectors (tablelocations)
                let locations = Object.keys(groupedTables);
                locations = locations.map(loc => ({tablelocation: loc}));
                res.render('tables', {
                    layout: "main",
                    pageTitle: pageTitle,
                    locations: locations,
                    tables: groupedTables,
                });
            }
    });
}

export async function orderOfTable(req, res){
    const pageTitle = 'Order';
    let status = [{status:'Not Ready'}, {status: 'Ready for service'}, {status: 'Standby'}, {status: 'Cancelled'}, {status: 'Paid'}] ;
    await table.getLastOrderOfTable(req.params.id, (err, order) => {
        if (err){
            console.log(err);
            res.status(500).send('Error finding order');
        }
        else{
            if (order.length === 0){
                res.status(404).send('No order found');
            }else{
                for (let stat of status){
                    if (stat.status === order[0].status){
                        stat.selected = true;}
                }
                res.render('tables_order', {layout: "main", pageTitle: pageTitle, items: order, status: status});
            }
        }
    }
    )}

export async function updateOrderStatus(req, res){
    await order.updateOrderStatus(req.body.orderId, req.body.status, (err, data) => {
        if (err){
            console.log(err);
            res.status(500).send('Error updating order status');
        }
        else{
            res.status(200).send('Order status updated');
        }
    });
}


export async function getOneLocation(req, res){
    const pageTitle = 'Tables';
    await table.getTablesStatus((err, tables) => {
            if (err){
                console.log(err);
                res.status(500).send('Error finding tables');
            }
            else{
                let groupedTables = tables.reduce((acc, tab) => {
                    if (!acc[tab.tablelocation]){
                        acc[tab.tablelocation] = [];
                    }
                    if (tab.status === null){
                        tab.status = 'Free';
                    }
                    acc[tab.tablelocation].push(tab);
                    return acc;
                }, {});
                let locations = Object.keys(groupedTables);
                locations = locations.map(loc => ({tablelocation: loc}));
                for(let loc of locations) {
                    if (loc.tablelocation == req.params.sector) {
                        loc.chosen = true;
                    }
                }
                //keep only the tables of the selected sector
                for(let loc in groupedTables) {
                    if (loc !== req.params.sector) {
                        delete groupedTables[loc];
                    }
                }
                res.render('tables', {
                    layout: "main",
                    pageTitle: pageTitle,
                    locations: locations,
                    tables: groupedTables,
                });
            }
        });
}


