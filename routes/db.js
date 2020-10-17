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

const findUser = (app) => {
    app.route('/find-user/:email').get(async (req, res) => {
        console.log("find user")
        let email = req.params.email
        console.log("email", email)
        let query = `SELECT * FROM users WHERE email='${email}'`
        let user = await new Promise((resolve, reject) => db.query(query, (err, Qresults) => {
            if (err) {
                console.log('🐣')
                reject(err)
            } else {
                console.log('🥚')
                resolve(Qresults)
            }
        }))
        // console.log("user", user)
        res.json(user)
    })
}; 

const registerUser = (app) => {
    app.route('/register-user/:email').get(async (req, res) => {
        // const { hash, email, phone, firstName, lastName } = req.params
        const email = req.params.email;
        const hash = req.query.hash;
        const phone = req.query.phone;
        const firstName = req.query.firstName;
        const lastName = req.query.lastName;
        
        console.log("register user") 
        
        let query = `INSERT INTO users (email,firstName,lastName,phone,password)`
          query += ` VALUES ("${email}", "${firstName}", "${lastName}", "${phone}", "${hash}"`
          query += `)`
          let results = await new Promise((resolve, reject) => db.query(query, (err, Qresults) => {
              if (err) {
                  console.log('🐣')
                  reject(err)
              } else {
                  console.log('🥚')
                  resolve(Qresults)
              }
          }))
        // console.log("user", user)
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
    findUser(app)
    registerUser(app)
  }