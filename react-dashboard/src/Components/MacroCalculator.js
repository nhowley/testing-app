import React, { Component } from "react";
import TrainingDaySelect from './TrainingDaySelect'
import MacroTable from './MacroTable'
import { proteinMultipliers, carbMultipliers, fatMultipliers, newProteinMultipliers, newCarbMultipliers, newFatMultipliers } from '../macroMultipliers.js'
import axios from "axios"

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
            newProteinMultipliers: newProteinMultipliers,
            newCarbMultipliers: newCarbMultipliers,
            newFatMultipliers: newFatMultipliers,
            trainingTypes: ["health", "endurance", "team", "strength", "hypocaloric", "hypercaloric"],
            proteinByTraining: {},
            carbsByTraining:{},
            fatByTraining:{},
            clientMaintenanceCalories: 0
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
        e.preventDefault()
        console.log("calculating macros...")
        await this.convertWeight()
        this.calculateMaintenance()
        this.newCalculateMaintenanceMacros()

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

    calculateMaintenance = () => {
        console.log("weight", this.state.weightPounds)
        let weight = this.state.weightPounds
        this.state.maintenanceCalories.forEach(range => {
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


                console.log("newCalories", newCalories)

                this.setState({
                    clientMaintenanceCalories: newCalories
                })
            }
        })
    }

    newCalculateMaintenanceMacros= () => {
        const { weightPounds, newProteinMultipliers, newCarbMultipliers, newFatMultipliers, clientMaintenanceCalories } = this.state
        
        // get protein amounts per activity and per training type
        const proteinArray = Object.entries(newProteinMultipliers);
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
            this.setState({
                proteinByTraining: proteinByTraining
            })
        })

        // get carbs amounts per activity and per training type
        const carbsArray = Object.entries(newCarbMultipliers);
        let carbsByTraining = {}
        carbsArray.forEach(([key, value]) => {
            const trainingArray = Object.entries(value);
            const newCarbs = {}
            trainingArray.forEach(([key2, value2]) => {
                let recommendedCarbs = Math.round(value2.recommended * weightPounds)

                if(isNaN(value2.recommended)){
                    recommendedCarbs= 'CCH'
                }
                let values = {
                    min: Math.round(value2.min * weightPounds),
                    max: Math.round(value2.max * weightPounds),
                    recommended: recommendedCarbs
                }
                newCarbs[key2] = values
            })
            carbsByTraining[key] = newCarbs
            this.setState({
                carbsByTraining: carbsByTraining
            })
        })

        // get fat amounts per activity and per training type
        const fatArray = Object.entries(newFatMultipliers);
        let fatByTraining = {}
        fatArray.forEach(([key, value]) => {
            const trainingArray = Object.entries(value);
            const newFat = {}
            trainingArray.forEach(([key2, value2]) => {
                
                let caloriesObj = clientMaintenanceCalories
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

                let values = {
                    min: Math.round(value2.min * weightPounds),
                    max: 'CCH',
                    recommended: fatRec
                }
                newFat[key2] = values
            })
            fatByTraining[key] = newFat
            this.setState({
                fatByTraining: fatByTraining
            })
        })

    }

  


    render(){
        const { exerciseDays, proteinByTraining, carbsByTraining, fatByTraining, clientMaintenanceCalories, trainingTypes } = this.state
        const state = this.state

        // let proteinArray = Object.entries(proteinByTraining);

        let exerciseDaysArr = []
        for (let i = 0; i < exerciseDays; i++) {
            exerciseDaysArr.push(<TrainingDaySelect key={i} i={i} setInfoFromChild={this.setInfoFromChild}/>)
        }

        let tables = []
        for (let i = 0; i < trainingTypes.length; i++) {
            let type = trainingTypes[i]
            tables.push(<MacroTable type={trainingTypes[i]} protein={proteinByTraining[type]} carbs={carbsByTraining[type]} fat={fatByTraining[type]} calories={clientMaintenanceCalories}></MacroTable>)
        }


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

            </div>
        );
    }
}


export default MacroCalculator