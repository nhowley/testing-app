import React, { Component } from "react";
import TrainingDaySelect from './TrainingDaySelect'
import MacroTable from './MacroTable'
import { proteinMultipliers, carbMultipliers, fatMultipliers } from '../macroMultipliers.js'
import axios from "axios"
import { concatSeries } from "async";

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
            trainingTypes: ["health", "endurance", "team", "strength"],
            dietTypes: ["hypocaloric", "hypercaloric"],
            proteinByTraining: {},
            carbsByTraining:{},
            fatByTraining:{},
            proteinFatLoss: {},
            carbsFatLoss:{},
            fatFatLoss:{},
            clientMaintenanceCalories: 0,
            dailyCalDeficit: 500
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
        console.log("updatedTrainingIfo", updatedTrainingInfo)
        this.setState({
            trainingInfo: updatedTrainingInfo
        })
    }

    calculateMacros = async (e) => {
        const { maintenanceCalories, proteinMultipliers, carbMultipliers, fatMultipliers, clientFatLossCalories } = this.state
        e.preventDefault()
        await this.convertWeight()
        await this.calculateMaintenance(maintenanceCalories)
        await this.calculateMaintenanceMacros(proteinMultipliers, carbMultipliers, fatMultipliers)
        let fatLossCalories = await this.calcFatLossCalories()
        console.log("clientFat", clientFatLossCalories)
        await this.calcFatLossMacros(proteinMultipliers, carbMultipliers, fatMultipliers, fatLossCalories)
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
        console.log("weight", this.state.weightPounds)
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
        let fatByTraining = await this.calcMaintenanceFat(this.state.clientMaintenanceCalories)
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
    calcMaintenanceFat = (caloriesObj) => {
        const { weightPounds, fatMultipliers} = this.state
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

    calcFatLossCalories = async () => {
        let caloriesArr = Object.entries(this.state.clientMaintenanceCalories);
        let newCaloriesArr =  caloriesArr.map(([key, value]) => {
                value = value - this.state.dailyCalDeficit
                console.log("value", value)
                return [key,value]
                
        })
        let caloriesObj = Object.fromEntries(newCaloriesArr)
        console.log("caloriesObj", caloriesObj)
        this.setState({
            clientFatLossCalories: caloriesObj
        })
        return caloriesObj
    }


    calcFatLossMacros = async (proteinMultipliers, carbMultipliers, fatMultipliers, calories) => {
        let proteinFatLoss = await this.calcMaintenanceProtein(proteinMultipliers)
        let fatFatLoss =  await this.calcFatLossFat()
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
    calcFatLossFat = () => {
        const { weightPounds, fatMultipliers } = this.state
        // get fat amounts per activity and per training type
        const fatArray = Object.entries(fatMultipliers);
        let fatByTraining = {}
        fatArray.forEach(([key, value]) => {
            const trainingArray = Object.entries(value);
            const newFat = {}
            trainingArray.forEach(([key2, value2]) => {
                let max = Math.round(value2.max * weightPounds)
                if(isNaN(value2.max)){
                    max= 'CCH'
                }
                let values = {
                    min: Math.round(value2.min * weightPounds),
                    max: max,
                    recommended:Math.round(value2.min * weightPounds)
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
                console.log("proteinRec", proteinRec)
                console.log("fatRec", fatRec)
                console.log("carbsRecCalories", carbsRecCalories)
                console.log("carbsRec", carbsRec)

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


    render(){
        const { exerciseDays, proteinByTraining, carbsByTraining, fatByTraining, clientMaintenanceCalories, trainingTypes, proteinMultipliers, clientFatLossCalories, proteinFatLoss, carbsFatLoss, fatFatLoss } = this.state
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
                calculateMaintenanceMacros={this.calculateMaintenanceMacros}>
                </MacroTable>)
        }

        tables.push(
            <MacroTable type="hypocaloric" 
                protein={proteinFatLoss.hypocaloric} 
                carbs={carbsFatLoss.hypocaloric} 
                fat={fatFatLoss.hypocaloric} 
                calories={clientFatLossCalories} 
                proteinMultipliers={proteinMultipliers} 
                carbMultipliers={carbMultipliers}
                fatMultipliers={fatMultipliers}
                calculateMaintenanceMacros={this.calculateMaintenanceMacros}>
            </MacroTable> 
        )


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
                <button className="mt-4" onClick={(e) => {this.calculateMacros(e)}}>Submit</button>
                {Object.keys(proteinByTraining).length !== 0 && proteinByTraining.constructor === Object ? tables : null }
                {/* {this.state.clientFatLossCalories ? 
                    <MacroTable type="hypocaloric" 
                        protein={proteinByTraining.hypocaloric} 
                        carbs={carbsByTraining.hypocaloric} 
                        fat={fatByTraining.hypocaloric} 
                        calories={clientFatLossCalories} 
                        proteinMultipliers={proteinMultipliers} 
                        carbMultipliers={carbMultipliers}
                        fatMultipliers={fatMultipliers}
                        calculateMaintenanceMacros={this.calculateMaintenanceMacros}>
                    </MacroTable> 
                : null } */}
            </div>
        );
    }
}


export default MacroCalculator