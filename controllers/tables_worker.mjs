import { rmSync } from 'fs';
import table from '../models/table.mjs';
import util from 'util';

/*
async function getTables(req, res){
    const pageTitle = 'Tables';
    await table.getAllTables(async (err, tables) => {
        await table.getTableLocations(async (err, locs) => {
            if (err){
                console.log(err);
                res.status(500).send('Error finding tables');
            }
            else{
                const groupedTables = await tables.reduce(async (acc, tab) => {
                    if (!acc[tab.tablelocation]){
                        acc[tab.tablelocation] = [];
                    }
                    await table.isTableAvailable(tab.tableid, async (err, statBool) => {
                        if (err){
                            console.log(err);
                            res.status(500).send('Error finding tables');
                        }
                        let stat;
                        if (statBool === true){
                            stat = 'Free';
                        }
                        else if (statBool === false){
                            stat = 'Occupied';
                        }
                        const tableObj = {
                            name: tab.tablelocation+' '+tab.name,    // 'tab' is the current table object from the 'tables' array
                            //status:'123'
                            status: stat   // Initial status set to an empty string
                        };
                        acc[tab.tablelocation].push(tableObj);
                        return acc;
                    });    
                }, {});
            res.render('tables', {layout: "main", pageTitle: pageTitle, sectors: locs, chosenSector: '', tables: groupedTables});
            }
        });
    });
}*/

async function getTables(req, res) {
    const pageTitle = 'Tables';

    const getAllTablesAsync = util.promisify(table.getAllTables);
    const getTableLocationsAsync = util.promisify(table.getTableLocations);
    const isTableAvailableAsync = util.promisify(table.isTableAvailable);
    
    try {
        const tables = await getAllTablesAsync();
        const locs = await getTableLocationsAsync();

        const locsObj = {
            locs: locs.map(loc => ({
                tablelocation: loc
            }))
        };

        const groupedTables = await tables.reduce(async (accPromise, tab) => {
            const acc = await accPromise;

            if (!acc[tab.tablelocation]) {
                acc[tab.tablelocation] = [];
            }

            const statBool = await isTableAvailableAsync(tab.tableid);
            let stat;
            if (statBool === true) {
                stat = 'Free';
            } else if (statBool === false) {
                stat = 'Occupied';
            }
            const tableObj = {
                name: tab.tablelocation+' '+tab.name,
                status: stat
            };
            acc[tab.tablelocation].push(tableObj);

            return acc;
        }, Promise.resolve({}));

        res.render('tables', {
            layout: "main",
            pageTitle: pageTitle,
            locs: locsObj.locs,
            chosenSector: '',
            tables: groupedTables
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error finding tables');
    }
}


async function getOneLocation(req, res){
    const pageTitle = 'Tables';

    const getAllTablesAsync = util.promisify(table.getAllTables);
    const getTableLocationsAsync = util.promisify(table.getTableLocations);
    const isTableAvailableAsync = util.promisify(table.isTableAvailable);
    
    try{
        const tables = await getAllTablesAsync();
        const locs = await getTableLocationsAsync();

        const locsObj = {
            locs: locs.map(loc => ({
                tablelocation: loc
            }))
        };

        const groupedTables = await tables.reduce(async (accPromise, tab) => {
            const acc = await accPromise;

            if (!acc[tab.tablelocation]) {
                acc[tab.tablelocation] = [];
            }

            const statBool = await isTableAvailableAsync(tab.tableid);
            let stat;
            if (statBool === true) {
                stat = 'Free';
            } else if (statBool === false) {
                stat = 'Occupied';
            }

            const tableObj = {
                name: tab.tablelocation+' '+tab.name,
                status: stat
            };
            acc[tab.tablelocation].push(tableObj);

            return acc;
        }, Promise.resolve({}));

        for (let sector of locsObj.locs){
            if (sector.tablelocation == req.params.tablelocation){
                sector.chosen = true;
            }
        }
        res.render('tables', {layout: "main", pageTitle: pageTitle, sectors: locsObj.locs, chosenSector: req.params.tablelocation, tables: groupedTables});
    }catch (err) {
        console.log(err);
        res.status(500).send('Error finding tables');
    }
}


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
export { getTables, getOneLocation };
    