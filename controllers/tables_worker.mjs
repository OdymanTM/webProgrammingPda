import table from '../models/table.mjs';

async function getTables(req, res){
    const pageTitle = 'Tables';
    await table.getAllTables(async (err, tables) => {
        await table.getTableLocations(async (err, locs) => {
            if (err){
                console.log(err);
                res.status(500).send('Error finding tables');
            }
            else{
                const groupedTables = tables.reduce((acc, tab) => {
                    if (!acc[tab.locationInStore]){
                        acc[tab.locationInStore] = [];
                    }
                    acc[tab.locationInStore].push(tab);
                    return acc;
                }, {})
            res.render('tables', {layout: "main", pageTitle: pageTitle, sectors: locs, chosenSector: '', tables: groupedTables});
            }
        });
    });
}

async function getOneLocation(req, res){
    const pageTitle = 'Tables';
    await table.getTablesByLocationInStore(req.params.locationInStore, async (err, tables) => {
        await table.getTableLocations((err, locs) => {
            if (err){
                console.log(err);
                res.status(500).send('Error finding tables');
            }
            else{
                const groupedTables = tables.reduce((acc, tab) => {
                    if (!acc[tab.locationInStore]){
                        acc[tab.locationInStore] = [];
                    }
                    acc[tab.locationInStore].push(tab);
                    return acc;
                }, {});
                for (let sector of locs){
                    if (sector.locationInStore == req.params.locationInStore){
                        sector.chosen = true;
                    }
                }
                res.render('tables', {layout: "main", pageTitle: pageTitle, sectors: locs, chosenSector: req.params.locationInStore, tables: groupedTables});
            }
        });
    })
}
    
export { getTables, getOneLocation };
    