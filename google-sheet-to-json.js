var https = require('https');
var path = require('path');
var fs = require('fs');


var id = '1T8sGNZOdAFS6-xXir03N098kBacl11ZCE3AWX-XPBu4'; // The Google Sheet ID found in the URL of your Google Sheet.

const worksheets = [
  {
    worksheetId: 'orl2jwq', // about page
    jsonFile: './public/reports/daily.json' // about file
  }
]

worksheets.forEach((worksheet) => {
  console.log("generating worksheets")
  https.get('https://spreadsheets.google.com/feeds/list/' + id + '/' + worksheet.worksheetId + '/public/values?alt=json', function(resp) {

  // console.log("resp", resp)
  var body = '';

  resp
    .on('data', function(data) {
      body += data;

    })
    .on('end', function() {

    //   var json = [];
      var rows = body.split(/\r\n/i);

    //   for (var i = 0; i < rows.length; i++) {
    //     json.push(rows[i].split(/\t/i));
    //   }

    const input = JSON.parse(rows).feed.entry


    // filter all objects to return only those which contain gsx (the cells with our text)
    input.forEach(cell => {

        //if key contains gsx then return the whole object for that key
        const filteredCells = Object.keys(cell).filter((k) => { return ~k.indexOf("gsx") === -1 })
        console.log("filteredCells", filteredCells)
          
          Object.keys(cell)
            .filter(key => !filteredCells.includes(key))
            .forEach(key => delete cell[key]);
          
          return cell
    })

    const formattedInput = []
    input.forEach(cell => {
        console.log("cell", cell)
      // get section and type text - these will always be our first and second keys
        const cellObject = Object.values(cell)
        const cellContent = []
        cellObject.forEach(cellobject => {cellContent.push(Object.values(cellobject).toString())})
        const firstKey = cellContent[0]
        const secondKey = cellContent[1]
        const languages = Object.entries(cell).slice(2)

        //remove gsx from string to just have the language codes (en, fr)
        const languageObjects = []
        languages.forEach(language => {
            let languageContent = Object.values(language[1]).toString()
            let newlanguage = language[0].replace("gsx$", '').toString()

            //change title of cells to something readable
            if (newlanguage === "howwelldidyouhityourgoalfortheday"){
                newlanguage = "goal"
            }

            if (newlanguage === "positivesfortoday"){
                newlanguage = "positives"
            }

            if (newlanguage === "howdoyoufeeloverall"){
                newlanguage = "general"
            }

            if (newlanguage === "howmanyhoursofsleepdidyougetlastnight"){
                newlanguage = "hoursSleep"
            }

            if (newlanguage === "howintensewasyourworkouttodayiftwoworkoutsdoneselectintensityofmostdifficultone"){
                newlanguage = "exerciseIntensity"
            }


            const languageObject = {[newlanguage]: languageContent}
            languageObjects.push(languageObject)
        })


        // merge the langauge objects so that they are they value of the second key
        const languageObject = Object.assign({}, ...languageObjects)
        const languagesObject = {[secondKey]: languageObject}
        const myObj = {[firstKey]: languagesObject};
        formattedInput.push((myObj))
    })


    console.log("formattedInput", formattedInput)

    // loop throught formatted input and create array of objects when the key is the same

    function combineKeyData(data) {
      var output = {}, item;
      // iterate the outer array to look at each item in that array
      for (var i = 0; i < data.length; i++) {
          item = data[i];
          // iterate each key on the object
          for (var prop in item) {
              if (item.hasOwnProperty(prop)) {
                  // if this keys doesn't exist in the output object, add it
                  if (!(prop in output)) {
                      output[prop] = {};
                  }
                  // add data onto the end of the key's array
                  Object.assign(output[prop], item[prop]);
                  // output[prop].push(item[prop]);
              }
          }
      }
      return output;
  }

    console.log("formattedData", combineKeyData(formattedInput))
    const formattedData = combineKeyData(formattedInput)
  
      fs.writeFileSync(path.resolve(__dirname, worksheet.jsonFile), JSON.stringify(formattedData));
      console.log('Generated test.json');
    });

  });
})


