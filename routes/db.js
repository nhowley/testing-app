const db = require('../db/db');

// return all cats in database
    const cats = (app) => {
        app.route('/cats').get(async (req, res) => {
            console.log("cats reached")
            let query = 'SELECT * FROM cats' 
            // let query = 'CREATE TABLE cats ( name VARCHAR(255), age INT );'
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
    cats(app)
  }