import React, { Component } from "react";
import TrainingDaySelect from './TrainingDaySelect'
import MacroTable from './MacroTable'
import { proteinMultipliers, carbMultipliers, fatMultipliers } from '../macroMultipliers.js'
import axios from "axios"
import { concatSeries } from "async";
import { object } from "prop-types";

class MacroCalculator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            exerciseDays: 2,
            weightEntered: 0,
            goal: '',
            trainingInfo: [],
            proteinMultipliers: proteinMultipliers,
            carbMultipliers: carbMultipliers,
            fatMultipliers: fatMultipliers,
            trainingTypes: [],
            dietTypes: ["hypocaloric", "hypercaloric"],
            proteinByTraining: {},
            carbsByTraining:{},
            fatByTraining:{},
            proteinFatLoss: {},
            carbsFatLoss:{},
            fatFatLoss:{},
            proteinMuscleGain: {},
            carbsMuscleGain:{},
            fatMuscleGain:{},
            clientMaintenanceCalories: 0,
            fatLossGoal: 1,
            dailyCalDeficit: 500,
            muscleGainGoal: 1,
            dailyCalSurplus: 500,
            trainingIntensities: []
        }
    }

    componentDidMount= () => {
        this.getMaintenanceCalories()
    }

    getMaintenanceCalories = () => {
        axios.get(`/maintenance`)
            .then((res) => {
                this.setState({ 
                    maintenanceCalories: res.data
                })
                
            })
            .catch((err) => {
                console.log(err)
            })
    }

    setTrainingDays = (e) => {
        this.setState({
            exerciseDays: e.target.value
        })
    }
 
    setWeight = (e) => {
       let weightEntered = e.target.value
       this.setState({
           weightEntered: weightEntered
       })
    }

    setUnits = (e) => {
        if(e.target.id === 'kilos'){
            this.setState({
                weightUnits: "kilos"
            })
        } else {
            this.setState({
                weightUnits: "pounds"
            }) 
        }
    }

    setGoal = (e) => {
        this.setState({
            goal: e.target.id
        })
    }

    setInfoFromChild = (i, object) =>{
        let updatedTrainingInfo = this.state.trainingInfo
        updatedTrainingInfo[i] = object
        
        this.setState({
            trainingInfo: updatedTrainingInfo
        })
    }

    setFatLossGoal = (fatLossGoal) => {
       let  weeklyCalories = fatLossGoal * 3500
       let dailyCalDeficit = weeklyCalories / 7
       this.setState({
           dailyCalDeficit: dailyCalDeficit
       })

       return dailyCalDeficit
    }

    setMuscleGainGoal = (muscleGainGoal) => {
        let  weeklyCalories = muscleGainGoal * 3500
        let dailyCalSurplus = weeklyCalories / 7
        this.setState({
            dailyCalSurplus: dailyCalSurplus
        })
 
        return dailyCalSurplus
     }

    calculateMacros = async (e) => {
        const { maintenanceCalories, proteinMultipliers, carbMultipliers, fatMultipliers, clientFatLossCalories, dailyCalDeficit, fatLossGoal, dailyCalSurplus } = this.state
        e.preventDefault()
        await this.convertWeight()
        await this.calculateMaintenance(maintenanceCalories)
        await this.calculateMaintenanceMacros(proteinMultipliers, carbMultipliers, fatMultipliers)
        await this.setFatLossGoal(this.state.fatLossGoal)
        let fatLossCalories = await this.calcFatLossCalories(dailyCalDeficit)
        await this.calcFatLossMacros(proteinMultipliers, carbMultipliers, fatMultipliers, fatLossCalories)
        let muscleGainCalories = await this.calcMuscleGainCalories(dailyCalSurplus)
        await this.calcMuscleGainMacros(proteinMultipliers, carbMultipliers, fatMultipliers, muscleGainCalories)
    }

    convertWeight = () =>{
        let weightKilos;
        let weightPounds
        if(this.state.weightUnits === 'kilos'){
            weightKilos = this.state.weightEntered
            weightPounds = Math.round(weightKilos * 2.20462)
        } else {
            weightPounds = this.state.weightEntered
            weightKilos = Math.round(weightPounds * 0.453592)
        }
        this.setState({
            weightKilos: weightKilos,
            weightPounds: weightPounds
        })
    }

    calculateMaintenance = (calories) => {
        let weight = this.state.weightPounds
        calories.forEach(range => {
            if (weight > range.bodyweight_min && weight < range.bodyweight_max){
                const caloriesArray = Object.entries(range);
        
                const newCalories = {}
                caloriesArray.forEach(([key, value]) => {
                    if (key === 'non_training') {
                        newCalories.rest = value
                    }
                    if (key === 'extra_hard') {
                        newCalories.extraHard = value
                    }
                    if (key !== 'bodyweight_min' && key !== 'bodyweight_max' && key !== 'non_training' && key !== 'extra_hard'){
                        newCalories[key] = value
                    }
                });

                this.setState({
                    clientMaintenanceCalories: newCalories
                })
                return newCalories
            }
        })
    }

    //to do - add possibility to change the protein multiplier once macros are calculated - proteinMultipliers.strength.rest.recommended = {input} 

    calculateMaintenanceMacros= async (proteinMultipliers, carbMultipliers, fatMultipliers) => {
        let proteinByTraining = await this.calcMaintenanceProtein(proteinMultipliers)
        let carbsByTraining = await this.calcMaintenanceCarbs(carbMultipliers)
        this.setState({
            proteinByTraining: proteinByTraining,
            carbsByTraining: carbsByTraining
        })
        let fatByTraining = await this.calcMaintenanceFat(this.state.clientMaintenanceCalories, fatMultipliers)
        this.setState({
            fatByTraining: fatByTraining,
            
        })
    }

  
    calcMaintenanceProtein = (proteinMultipliers) => {
        const { weightPounds } = this.state
        // get protein amounts per activity and per training type
        const proteinArray = Object.entries(proteinMultipliers);
        let proteinByTraining = {}
        proteinArray.forEach(([key, value]) => {
            const trainingArray = Object.entries(value);
            const newProtein = {}
            trainingArray.forEach(([key2, value2]) => {
                let values = {
                    min: Math.round(value2.min * weightPounds),
                    max: Math.round(value2.max * weightPounds),
                    recommended: Math.round(value2.recommended * weightPounds)
                }
                newProtein[key2] = values
            })
            proteinByTraining[key] = newProtein
            
        })
        return proteinByTraining
        
    }

    calcMaintenanceCarbs = () => {
        const { weightPounds, carbMultipliers } = this.state
        // get carbs amounts per activity and per training type
        const carbsArray = Object.entries(carbMultipliers);
        let carbsByTraining = {}
        carbsArray.forEach(([key, value]) => {
            const trainingArray = Object.entries(value);
            const newCarbs = {}
            trainingArray.forEach(([key2, value2]) => {
                let recommendedCarbs = Math.round(value2.recommended * weightPounds)
                let max = Math.round(value2.max * weightPounds)
                if(isNaN(value2.recommended)){
                    recommendedCarbs= 'CCH'
                }
                if(isNaN(value2.max)){
                    max= 'CCH'
                }
                let values = {
                    min: Math.round(value2.min * weightPounds),
                    max: Math.round(value2.max * weightPounds),
                    recommended:recommendedCarbs
                }
                newCarbs[key2] = values
            })
            carbsByTraining[key] = newCarbs
            
        })
        return carbsByTraining
    }

    // IF hypocaloric, fat should be 0.3 min and what's left should be in carbs
    calcMaintenanceFat = (caloriesObj, fatMultipliers) => {
        const { weightPounds } = this.state
        // get fat amounts per activity and per training type
        const fatArray = Object.entries(fatMultipliers);
        let fatByTraining = {}
        fatArray.forEach(([key, value]) => {
            const trainingArray = Object.entries(value);
            const newFat = {}
            trainingArray.forEach(([key2, value2]) => {
                
                
                const caloriesArray = Object.entries(caloriesObj);

                let calories;
                caloriesArray.forEach(([key3, value3]) => {
                    if(key3 === key2){
                        calories = value3
                    }
                })

                let proteinRec = this.state.proteinByTraining[key][key2].recommended
                let carbsRec = this.state.carbsByTraining[key][key2].recommended
                let fatRecCalories = calories - ((proteinRec + carbsRec) * 4)
                let fatRec = Math.round(fatRecCalories / 9)

                if(!isNaN(value.recommended)){
                    fatRec= 'CCH'
                }

                let values = {
                    min: Math.round(value2.min * weightPounds),
                    max: 'CCH',
                    recommended: fatRec
                }
                newFat[key2] = values
            })
            fatByTraining[key] = newFat
           
        })
        return fatByTraining
    }

    calcFatLossCalories = async (dailyCalDeficit) => {
        let caloriesArr = Object.entries(this.state.clientMaintenanceCalories);
        let newCaloriesArr =  caloriesArr.map(([key, value]) => {
                value = value - dailyCalDeficit
                return [key,value]
                
        })
        let caloriesObj = Object.fromEntries(newCaloriesArr)
        this.setState({
            clientFatLossCalories: caloriesObj
        })
        return caloriesObj
    }


    calcFatLossMacros = async (proteinMultipliers, carbMultipliers, fatMultipliers, calories) => {
        console.log("fatlossmacrosreached")
        console.log("fatMultipliters", fatMultipliers)
        let proteinFatLoss = await this.calcMaintenanceProtein(proteinMultipliers)
        let fatFatLoss =  await this.calcFatLossFat(fatMultipliers)
        console.log("fatFatloss", fatFatLoss)
        this.setState({
            proteinFatLoss: proteinFatLoss,
            fatFatLoss: fatFatLoss,
        })
        let carbsFatLoss = await this.calcCarbsFatLoss(calories)
        this.setState({
            carbsFatLoss: carbsFatLoss
        })
    }

    // IF hypocaloric, fat should be 0.3 min and what's left should be in carbs
    calcFatLossFat = (fatMultipliers) => {
        const { weightPounds } = this.state
        // get fat amounts per activity and per training type
        const fatArray = Object.entries(fatMultipliers);
        let fatByTraining = {}
        fatArray.forEach(([key, value]) => {
            const trainingArray = Object.entries(value);
            const newFat = {}
            trainingArray.forEach(([key2, value2]) => {
                let recommended = Math.round(value2.recommended * weightPounds)
                let max = Math.round(value2.max * weightPounds)
                if(isNaN(value2.max)){
                    max= 'CCH'
                }
                if(isNaN(value2.recommended)){
                    recommended= value2.min * weightPounds
                }
                let values = {
                    min: Math.round(value2.min * weightPounds),
                    max: max,
                    recommended:recommended
                }
                newFat[key2] = values
            })
            fatByTraining[key] = newFat
            
        })
        return fatByTraining
    }

    calcCarbsFatLoss = (caloriesObj) => {
        const { weightPounds, carbMultipliers } = this.state
        // get carbs amounts per activity and per training type
        const carbsArray = Object.entries(carbMultipliers);
        let carbsByTraining = {}
        carbsArray.forEach(([key, value]) => {
            const trainingArray = Object.entries(value);
            const newCarbs = {}
            trainingArray.forEach(([key2, value2]) => {
                const caloriesArray = Object.entries(caloriesObj);

                let calories;
                caloriesArray.forEach(([key3, value3]) => {
                    if(key3 === key2){
                        calories = value3
                    }
                })

                let proteinRec = this.state.proteinFatLoss[key][key2].recommended
                let fatRec = this.state.fatFatLoss[key][key2].recommended
                let carbsRecCalories = calories - ((proteinRec * 4) + (fatRec * 9))
                let carbsRec = Math.round(carbsRecCalories / 4)

                if(!isNaN(value.recommended)){
                    carbsRec= 'CCH'
                }

                let values = {
                    min: Math.round(value2.min * weightPounds),
                    max: 'CCH',
                    recommended: carbsRec
                }
                newCarbs[key2] = values
            })
            carbsByTraining[key] = newCarbs
           
        })
        return carbsByTraining
    }

    calcMuscleGainCalories = async () => {
        let caloriesArr = Object.entries(this.state.clientMaintenanceCalories);
        let newCaloriesArr =  caloriesArr.map(([key, value]) => {
                value = value + this.state.dailyCalSurplus
                return [key,value]
                
        })
        let caloriesObj = Object.fromEntries(newCaloriesArr)
        this.setState({
            clientMuscleGainCalories: caloriesObj
        })
        return caloriesObj
    }

    calcMuscleGainMacros = async (proteinMultipliers, carbMultipliers, fatMultipliers, calories) => {
        let proteinMuscleGain = await this.calcMaintenanceProtein(proteinMultipliers)
        let carbsMuscleGain = await this.calcMaintenanceCarbs(carbMultipliers)
        this.setState({
            proteinMuscleGain: proteinMuscleGain,
            carbsMuscleGain: carbsMuscleGain
        })
        let fatMuscleGain = await this.calcMuscleGainFat(calories, fatMultipliers)
        this.setState({
            fatMuscleGain: fatMuscleGain,
            
        })
    }

    calcMuscleGainFat = (caloriesObj, fatMultipliers) => {
        const { weightPounds } = this.state
        // get fat amounts per activity and per training type
        const fatArray = Object.entries(fatMultipliers);
        let fatMuscleGain = {}
        fatArray.forEach(([key, value]) => {
            const trainingArray = Object.entries(value);
            const newFat = {}
            trainingArray.forEach(([key2, value2]) => {
                
                
                const caloriesArray = Object.entries(caloriesObj);

                let calories;
                caloriesArray.forEach(([key3, value3]) => {
                    if(key3 === key2){
                        calories = value3
                    }
                })

                let proteinRec = this.state.proteinMuscleGain[key][key2].recommended
                let carbsRec = this.state.carbsMuscleGain[key][key2].recommended
                let fatRecCalories = calories - ((proteinRec + carbsRec) * 4)
                let fatRec = Math.round(fatRecCalories / 9)

                if(!isNaN(value.recommended)){
                    fatRec= 'CCH'
                }

                let values = {
                    min: Math.round(value2.min * weightPounds),
                    max: 'CCH',
                    recommended: fatRec
                }
                newFat[key2] = values
            })
            fatMuscleGain[key] = newFat
           
        })
        return fatMuscleGain
    }


    // onClick submit, check workouts  - we want to know if they have any double workout days and how intense these are to choose the calories needed

    getWorkouts = async (e) => {
        let singleArr = []
        let doubleArr = []
        let trainingTypes = []

        if (this.state.trainingInfo) {
            this.state.trainingInfo.forEach(training => {
                if(training.singleWorkout){
                    singleArr.push(training)
                } else if (training.doubleWorkout){
                    doubleArr.push(training)
                }
                if(training.trainingTypeSingle && training.trainingTypeSingle !== "other"){
                    trainingTypes.push(training.trainingTypeSingle)
                } else if(training.trainingTypeW1 && training.trainingTypeW1 !== "other"){
                    trainingTypes.push(training.trainingTypeW1)
                    trainingTypes.push(training.trainingTypeW2)
                }
            })
        }

        let uniqueTypes = [...new Set(trainingTypes)];

        let intensititesSingle = []
        singleArr.forEach(training => {
            intensititesSingle.push(training.trainingIntensitySingle)
        })

        let intensititesDouble = []
        doubleArr.forEach(training => {
            if(training.trainingIntensityW1 === "light" && training.trainingIntensityW2 === "light"){
                intensititesDouble.push("moderate")
            }

            if ((training.trainingIntensityW1 === "light" && training.trainingIntensityW2 === "moderate") || (training.trainingIntensityW1 === "moderate" && training.trainingIntensityW2 === "light")){
                intensititesDouble.push("moderate")
            }

            if ((training.trainingIntensityW1 === "light" && training.trainingIntensityW2 === "hard") || (training.trainingIntensityW1 === "hard" && training.trainingIntensityW2 === "light")){
                intensititesDouble.push("hard")
            }

            if (training.trainingIntensityW1 === "moderate" && training.trainingIntensityW2 === "moderate"){
                intensititesDouble.push("hard")
            }

            if ((training.trainingIntensityW1 === "moderate" && training.trainingIntensityW2 === "hard") || (training.trainingIntensityW1 === "hard" && training.trainingIntensityW2 === "moderate")){
                intensititesDouble.push("hard")
            }

            if (training.trainingIntensityW1 === "hard" && training.trainingIntensityW2 === "hard"){
                intensititesDouble.push("extraHard")
            }
        })

        this.setState({
            trainingTypes: uniqueTypes,
            trainingIntensities: intensititesSingle.concat(intensititesDouble),
            trainingIntensitiesSingle: intensititesSingle,
            trainingIntensitiesDouble: intensititesDouble
        }, () => this.calculateMacros(e))

        //TO DO - highlight correct rows
    }

    saveToDatabase = () => {
        let carbsStrength = this.state.carbsByTraining.strength
        let proteinStrength = this.state.proteinByTraining.strength
        let fatStrength = this.state.fatByTraining.strength

        let strengthArr = []
        strengthArr.push({carbs: carbsStrength})
        strengthArr.push({protein: proteinStrength})
        strengthArr.push({fat: fatStrength})

        var i = 0

        console.log("strengthArr", strengthArr)

        let newArr = []
    
        strengthArr.forEach((key) => {
            let macroArr = Object.entries(key)
            
            macroArr.forEach(([key2, value2]) => {
                let rangeArr = Object.entries(value2)
                
                rangeArr.forEach(([key3, value3]) => {
                    console.log("key3", key3)
                    console.log("value3", value3)
                    console.log(`${key2}Min`)
                    let newKeyMin = `${key2}Min`
                    let newKeyMax= `${key2}Max`
                    let newKeyRecommended= `${key2}Recommended`
                    let obj = {}
                            obj[key3]= {
                                    [newKeyMin]: value3.min,
                                    [newKeyMax]: value3.max,
                                    [newKeyRecommended]: value3.recommended

                            }
                    newArr.push(obj)
                    
                    // let trainingTypeArr = Object.entries(value3)
                    // trainingTypeArr.forEach(([key4,value4]) => {
                    //     console.log("key4", key4)
                    //     console.log("value4", value4)
                    //     newArr.push(
                    //         {
                    //             [key3]: {
                    //                     [newKey]: value4
                    //             }
                    //         }
                    //     )
                    // })
                console.log("newArr", newArr)
                
            })



            const object = Object.assign({}, ...newArr)
            console.log("object", object)

            let newObj = { "rest":{}, "light":{}, "moderate":{}, "hard":{}, "extraHard":{} }
            let extraNewArr = Object.entries(newArr)
            extraNewArr.forEach(([key, value]) => {
                console.log("value", value)
                let values = Object.entries(value)
                values.forEach(([key2, value2]) => {
                    console.log("key2", key2)

                    console.log("value2", value2)
                    let values2 = Object.entries(value2)
                    values2.forEach(([key3, value3]) =>{
                        console.log("key3", key3)
                            newObj[key2][key3]= value3
                        
                    })
                    
                 })
            })
            
                

            console.log("newObj", newObj)

            
            // key.forEach(([key2, value2]) => {
            //     console.log(`${key}Min`)
                // let query = `INSERT INTO recommendations (Id,Name,IsActive)`
                // query += ` VALUES ("${company.Id}", "${company.Name}", "${company.IsActive}"`
                // query += `)`
                // query += ` ON DUPLICATE KEY UPDATE Id="${company.Id}", Name="${company.Name}", IsActive="${company.IsActive}"`
                // // console.log(query)
                // let results = await new Promise((resolve, reject) => dbod.query(query, (err, Qresults) => {
                //     if (err) {
                //         console.log('🐣')
                //         reject(err)
                //     } else {
                //         console.log('🥚')
                //         resolve(Qresults)
                //     }
                // }))
        //     }
        // )
            })
    })}
    

    render(){
        const { exerciseDays, proteinByTraining, carbsByTraining, fatByTraining, clientMaintenanceCalories, trainingTypes, proteinMultipliers, clientFatLossCalories, proteinFatLoss, carbsFatLoss, fatFatLoss, clientMuscleGainCalories, proteinMuscleGain, carbsMuscleGain, fatMuscleGain, calcFatLossCalories, calcFatLossMacros, calcMuscleGainMacros, trainingIntensities, trainingIntensitiesSingle, trainingIntensitiesDouble, goal } = this.state
        const state = this.state

        // let proteinArray = Object.entries(proteinByTraining);

        let exerciseDaysArr = []
        for (let i = 0; i < exerciseDays; i++) {
            exerciseDaysArr.push(<TrainingDaySelect key={i} i={i} setInfoFromChild={this.setInfoFromChild}/>)
        }

        let tables = []
        for (let i = 0; i < trainingTypes.length; i++) {
            let type = trainingTypes[i]
            tables.push(<MacroTable type={trainingTypes[i]} 
                protein={proteinByTraining[type]} 
                carbs={carbsByTraining[type]} 
                fat={fatByTraining[type]} 
                calories={clientMaintenanceCalories} 
                proteinMultipliers={proteinMultipliers} 
                carbMultipliers={carbMultipliers}
                fatMultipliers={fatMultipliers}
                calculateMaintenanceMacros={this.calculateMaintenanceMacros}
                trainingIntensities={trainingIntensities}
                >
                </MacroTable>)
        }

        if(goal === 'lose-fat' || goal === 'lose-weight'){
            tables.push(
                <MacroTable type="hypocaloric" 
                    protein={proteinFatLoss.hypocaloric} 
                    carbs={carbsFatLoss.hypocaloric} 
                    fat={fatFatLoss.hypocaloric} 
                    calories={clientFatLossCalories} 
                    proteinMultipliers={proteinMultipliers} 
                    carbMultipliers={carbMultipliers}
                    fatMultipliers={fatMultipliers}
                    calculateMaintenanceMacros={this.calculateMaintenanceMacros}
                    calcFatLossMacros={this.calcFatLossMacros}
                    setFatLossGoal={this.setFatLossGoal}
                    calcFatLossCalories={this.calcFatLossCalories}
                    trainingIntensities={trainingIntensities}
                    >
                </MacroTable> 
            )
        }

        if(goal === 'gain-muscle'){
            tables.push(
                <MacroTable type="hypercaloric" 
                    protein={proteinMuscleGain.hypercaloric} 
                    carbs={carbsMuscleGain.hypercaloric} 
                    fat={fatMuscleGain.hypercaloric} 
                    calories={clientMuscleGainCalories} 
                    proteinMultipliers={proteinMultipliers} 
                    carbMultipliers={carbMultipliers}
                    fatMultipliers={fatMultipliers}
                    calculateMaintenanceMacros={this.calculateMaintenanceMacros}
                    calcMuscleGainMacros={this.calcMuscleGainMacros}
                    setMuscleGainGoal={this.setMuscleGainGoal}
                    calcMuscleGainCalories={this.calcMuscleGainCalories}
                    trainingIntensities={trainingIntensities}
                    >
                </MacroTable> 
            )
        }

        let doubleIntensititesArr = []
        {trainingIntensitiesDouble ? trainingIntensitiesDouble.forEach(training => {
            doubleIntensititesArr.push(<p>Intensity: {training}</p>)
        }) : null}

        let singleIntensititesArr = []
        {trainingIntensitiesSingle ? trainingIntensitiesSingle.forEach(training => {
            singleIntensititesArr.push(<p>Intensity: {training}</p>)
        }) : null}


        return (
            <div>
                <label htmlFor="weight">Weight</label>
                <input name="weight" id="weight" type="number" className="ml-2" onChange={(e) => this.setWeight(e)}></input>
                <input type="radio" name="unit" id="kilos" className="ml-2" onChange={(e) => this.setUnits(e)}></input>
                <label htmlFor="kilos" className="ml-1">kgs</label>
                <input type="radio" name="unit" id="pounds" className="ml-2" onChange={(e) => this.setUnits(e)}></input>
                <label htmlFor="pounds" className="ml-1">lbs</label>

                <h3 className="mt-3">Training sessions</h3>
                <label htmlFor="exercise-days">How many days do you exercise per week?</label>
                <input name="exercise-days" id="exercise-days" type="number" min="0" max="7" className="ml-2" onChange={(e) => {this.setTrainingDays(e)}}></input>
                {exerciseDaysArr}

                <h3 className="mt-3">Goals</h3>
                <p>What is your main goal?</p>
                <input type="radio" name="goal" id="lose-fat" className="ml-2" onChange={(e) => this.setGoal(e)}></input>
                <label htmlFor="lose-fat" className="ml-1">Lose fat</label>
                <br/>
                <input type="radio" name="goal" id="gain-muscle" className="ml-2" onChange={(e) => this.setGoal(e)}></input>
                <label htmlFor="gain-muscle" className="ml-1">Gain muscle</label>
                <br/>
                <input type="radio" name="goal" id="performance" className="ml-2" onChange={(e) => this.setGoal(e)}></input>
                <label htmlFor="performance" className="ml-1">Optimize sports performance</label>
                <br/>
                <input type="radio" name="goal" id="lose-weight" className="ml-2" onChange={(e) => this.setGoal(e)}></input>
                <label htmlFor="lose-weight" className="ml-1">Lose weight (more than 15 pounds)</label>
                <br/>
                <input type="radio" name="goal" id="health" className="ml-2" onChange={(e) => this.setGoal(e)}></input>
                <label htmlFor="health" className="ml-1">Improve health</label>
                <br/>
                <button className="mt-4" onClick={(e) => {this.getWorkouts(e)}}>Submit</button>
                <div className="client-training">
                    <p className="mt-4 h4">Client has {trainingIntensitiesDouble ? trainingIntensitiesDouble.length : null} double training days</p>
                    {doubleIntensititesArr}
                    <p className="mt-4 h4">Client has {trainingIntensitiesSingle ? trainingIntensitiesSingle.length : null} single training days</p>
                    {singleIntensititesArr}
                </div>
                {Object.keys(proteinByTraining).length !== 0 && proteinByTraining.constructor === Object ? tables : null }
                <button onClick={this.saveToDatabase}>Save</button>
            </div>
        );
    }
}


export default MacroCalculator