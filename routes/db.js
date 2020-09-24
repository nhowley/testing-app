const db = require('../db/db');

// return all cats in database
    const maintenance = (app) => {
        app.route('/maintenance').get(async (req, res) => {
            console.log("maintenance reached")
            let query = 'SELECT * FROM maintenance_calories' 
            const results = await new Promise((resolve, reject) => db.query(query, (err, Qresults) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Qresults);
                }
            }
            ));
            console.log("results", results)
            res.json(results)
    })
};

module.exports = function routes (app) {
    maintenance(app)
  }