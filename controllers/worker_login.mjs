import Worker from '../models/workers.mjs';

async function getAllWorkersUsernames (req, res){
    await Worker.getWorkersUsernames(async (err, workers) => {
        if (err){
            console.log(err);
            res.status(500).send('Error reading workers data');
        }
        else{
            workers.reduce((acc, user) => {
                if (!acc[user.username]) {
                    acc[user.username] = [];
                }
                acc[user.username].push(user);
                return acc;
            }, {});
        }
    })
}

async function getAllWorkersPasswords (req, res){
    await Worker.getWorkersPasswords(async (err, workers) => {
        if (err){
            console.log(err);
            res.status(500).send('Error reading workers data');
        }
        else{
            workers.reduce((acc, user) => {
                if (!acc[user.password]){
                    acc[user.password] = [];
                }
                acc[user.password].push(user);
                return acc;
            }, {});
        }
    })
}

export { getAllWorkersUsernames, getAllWorkersPasswords };