import { rmSync } from 'fs';
import table from '../models/table.mjs';
import order from '../models/order.mjs';
import util from 'util';


export async function getTables(req, res){
    const pageTitle = 'Tables';
    await table.getTablesStatus((err, tables) => {
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
    let status  ;
    await table.getLastOrderOfTable(req.params.id, (err, order) => {
        if (err){
            console.log(err);
            res.status(500).send('Error finding order');
        }
        else{
            if (order.length === 0){
                res.status(404).send('No order found');
            }else{
                console.log(order);
                res.render('tables_order', {layout: "main", pageTitle: pageTitle, items: order, status: status});
            }
        }
    }
    )}

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
// async function getTables(req, res) {
//     const pageTitle = 'Tables';

//     const getAllTablesAsync = util.promisify(table.getAllTables);
//     const getTableLocationsAsync = util.promisify(table.getTableLocations);
//     const isTableAvailableAsync = util.promisify(table.isTableAvailable);
//     const getActiveOrdersAsync = util.promisify(order.getActiveOrders);

//     try {
//         const tables = await getAllTablesAsync();
//         const locs = await getTableLocationsAsync();
//         const activeOrders = await getActiveOrdersAsync();

//         const locsObj = {
//             locs: locs.map(loc => ({
//                 tablelocation: loc
//             }))
//         };

//         const groupedTables = await tables.reduce(async (accPromise, tab) => {
//             const acc = await accPromise;

//             if (!acc[tab.tablelocation]) {
//                 acc[tab.tablelocation] = [];
//             }

//             const statBool = await isTableAvailableAsync(tab.tableid);
//             let stat;
//             if (statBool === true) {
//                 stat = 'Free';
//             } else if (statBool === false) {
//                 stat = 'Occupied';
//             }
//             const tableObj = {
//                 name: tab.tablelocation+' '+tab.name,
//                 status: stat
//             };
//             acc[tab.tablelocation].push(tableObj);

//             return acc;
//         }, Promise.resolve({}));
//         console.log(JSON.stringify(activeOrders), activeOrders);
//         res.render('tables', {
//             layout: "main",
//             pageTitle: pageTitle,
//             locs: locsObj.locs,
//             chosenSector: '',
//             tables: groupedTables,
//             activeOrders: JSON.stringify(activeOrders)
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Error finding tables');
//     }
// }

// async function getOneLocation(req, res){
//     const pageTitle = 'Tables';

//     const getAllTablesAsync = util.promisify(table.getAllTables);
//     const getTableLocationsAsync = util.promisify(table.getTableLocations);
//     const isTableAvailableAsync = util.promisify(table.isTableAvailable);
    
//     try{
//         const tables = await getAllTablesAsync();
//         const locs = await getTableLocationsAsync();

//         const locsObj = {
//             locs: locs.map(loc => ({
//                 tablelocation: loc
//             }))
//         };

//         const groupedTables = await tables.reduce(async (accPromise, tab) => {
//             const acc = await accPromise;

//             if (!acc[tab.tablelocation]) {
//                 acc[tab.tablelocation] = [];
//             }

//             const statBool = await isTableAvailableAsync(tab.tableid);
//             let stat;
//             if (statBool === true) {
//                 stat = 'Free';
//             } else if (statBool === false) {
//                 stat = 'Occupied';
//             }

//             const tableObj = {
//                 name: tab.tablelocation+' '+tab.name,
//                 status: stat
//             };
//             acc[tab.tablelocation].push(tableObj);

//             return acc;
//         }, Promise.resolve({}));

//         for (let sector of locsObj.locs){
//             if (sector.tablelocation == req.params.tablelocation){
//                 sector.chosen = true;
//             }
//         }
//         res.render('tables', {layout: "main", pageTitle: pageTitle, sectors: locsObj.locs, chosenSector: req.params.tablelocation, tables: groupedTables});
//     }catch (err) {
//         console.log(err);
//         res.status(500).send('Error finding tables');
//     }
// }


/*
    await table.getTablesByLocationInStore(req.params.tablelocation, async (err, tables) => {
        await table.getTableLocations((err, locs) => {
            if (err){
                console.log(err);
                res.status(500).send('Error finding tables');
            }
            else{
                const groupedTables = tables.reduce((acc, tab) => {
                    if (!acc[tab.tablelocation]){
                        acc[tab.tablelocation] = [];
                    }
                    const tableObj = {
                        name: tab.tablelocation+' '+tab.name,    // 'tab' is the current table object from the 'tables' array
                        status: '123'   // Initial status set to an empty string
                    };
                    acc[tab.tablelocation].push(tableObj);
                    return acc;
                }, {});
                for (let sector of locs){
                    if (sector.tablelocation == req.params.tablelocation){
                        sector.chosen = true;
                    }
                }
                res.render('tables', {layout: "main", pageTitle: pageTitle, sectors: locs, chosenSector: req.params.tablelocation, tables: groupedTables});
            }
        });
    })
}
  */  
    