const db = require('../db/db');

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

const recommendations = (app) => {
    app.route('/recommendations').get(async (req, res) => {
        console.log("recommendations reached")
        let recsArr = req.query.recs
        updateRecommendationsTable(recsArr)
        res.json("recommendations reached")
    })
};

const updateRecommendationsTable = async (recs) => {
    var i = 0
    
    // for(const company of companies) {
    //     console.log(i), i++
    //         let query = `INSERT INTO Companies (Id,Name,IsActive)`
    //         query += ` VALUES ("${company.Id}", "${company.Name}", "${company.IsActive}"`
    //         query += `)`
    //         query += ` ON DUPLICATE KEY UPDATE Id="${company.Id}", Name="${company.Name}", IsActive="${company.IsActive}"`
    //         // console.log(query)
    //         let results = await new Promise((resolve, reject) => dbod.query(query, (err, Qresults) => {
    //             if (err) {
    //                 console.log('🐣')
    //                 reject(err)
    //             } else {
    //                 console.log('🥚')
    //                 resolve(Qresults)
    //             }
    //         }))
    // }
}

module.exports = function routes (app) {
    maintenance(app)
  }