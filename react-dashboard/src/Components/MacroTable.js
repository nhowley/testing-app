import React, { Component } from "react";
import { carbMultipliers, fatMultipliers } from "../macroMultipliers";

class MacroTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            proteinMultiplier: this.props.proteinMultipliers[this.props.type].rest.recommended,
            fatMultiplier: this.props.fatMultipliers[this.props.type].rest.min
        }
    }

    onChange = (e) => {
        this.setState({
            proteinMultiplier: e.target.value
        })
    }

    onChangeFat = (e) => {
        this.setState({
            fatMultiplier: e.target.value
        })
    }

    updateProteinMultiplier = (e) => {
        let { type, proteinMultipliers, carbMultipliers, fatMultipliers, calories } = this.props
        let proteinMultiplierType = proteinMultipliers[type]

        const proteinArr = Object.entries(proteinMultiplierType);

        let newProteinArr = []
        proteinArr.forEach(([key, value]) => {
            value.recommended = Number(this.state.proteinMultiplier)
            newProteinArr.push([key, value])
        })

        let proteinObj = Object.fromEntries(newProteinArr);  
        let protein = this.props.proteinMultipliers
        protein[type] = proteinObj
        if (type === "hypocaloric"){
            this.props.calcFatLossMacros(protein, carbMultipliers, fatMultipliers, calories)
        } else {
            this.props.calculateMaintenanceMacros(protein, carbMultipliers, fatMultipliers)
        }
        
    }

    updateFatMultiplier = (e) => {
        let { type, proteinMultipliers, carbMultipliers, fatMultipliers, calories } = this.props
        let fatMultiplierFat = fatMultipliers[type]

        const fatArr = Object.entries(fatMultiplierFat);

        let newFatArr = []
        fatArr.forEach(([key, value]) => {
            value.recommended = Number(this.state.fatMultiplier)
            newFatArr.push([key, value])
        })
        console.log("newFatArr", newFatArr)

        let fatObj = Object.fromEntries(newFatArr);  
        let fat = this.props.fatMultipliers
        fat[type] = fatObj
        console.log("fat", fat)
        this.props.calcFatLossMacros(proteinMultipliers, carbMultipliers, fat, calories)
        
    }

    render(){
        const { type, protein, carbs, fat, calories, proteinMultipliers, carbMultipliers, fatMultipliers } = this.props
        return (
            <div className="macros mt-4">
                    <h3>Macros - {type}</h3>
                    <div className="d-flex">
                        <h4>Protein Multiplier:</h4>
                        <input type="number" defaultValue={proteinMultipliers[type].rest.recommended} onChange={(e) => this.onChange(e)}/>
                        <button className="ml-3" onClick={(e) => this.updateProteinMultiplier(e)}>Save</button>
                    </div>
                    {type === "hypocaloric" ?
                    <div className="d-flex">
                        <h4>Fat Multiplier:</h4>
                        <input type="number" defaultValue={fatMultipliers[type].rest.min} onChange={(e) => this.onChangeFat(e)}/>
                        <button className="ml-3" onClick={(e) => this.updateFatMultiplier(e)}>Save</button>
                    </div> : null }
                    
                    <table>
                        <tbody>
                            <tr>
                                <th>Training</th>
                                <th>Calories</th>
                                <th>Protein Range</th>
                                <th>Protein Recommended</th>
                                <th>Carbs Range</th>
                                <th>Carbs Recommended</th>
                                <th>Fat Range</th>
                                <th>Fat recommended</th>
                            </tr>
                            <tr>
                                <td>Non-training</td>
                                <td>{calories ? calories.rest : null}</td>
                                <td>{protein ? protein.rest.min : null}g - {protein ? protein.rest.max : null}g</td>
                                <td>{protein ? protein.rest.recommended : null}g</td>
                                <td>{carbs ? carbs.rest.min : null}g - {carbs ? carbs.rest.max : null}g</td>
                                <td>{carbs ? carbs.rest.recommended : null}g</td>
                                <td>{fat ? fat.rest.min : null}g - {fat ? fat.rest.max : null}g</td>
                                <td>{fat ? fat.rest.recommended : null}g</td>
                            </tr>
                            <tr>
                                <td>Light</td>
                                <td>{calories ? calories.light : null}</td>
                                <td>{protein ? protein.light.min : null}g - {protein ? protein.light.max : null}g</td>
                                <td>{protein ? protein.light.recommended : null}g</td>
                                <td>{carbs ? carbs.light.min : null}g - {carbs ? carbs.light.max : null}g</td>
                                <td>{carbs ? carbs.light.recommended : null}g</td>
                                <td>{fat ? fat.light.min : null}g - {fat ? fat.light.max : null}g</td>
                                <td>{fat ? fat.light.recommended : null}g</td>
                            </tr>
                            <tr>
                                <td>Moderate</td>
                                <td>{calories ? calories.moderate : null}</td>
                                <td>{protein ? protein.moderate.min : null}g - {protein ? protein.moderate.max : null}g</td>
                                <td>{protein ? protein.moderate.recommended : null}g</td>
                                <td>{carbs ? carbs.moderate.min : null}g - {carbs ? carbs.moderate.max : null}g</td>
                                <td>{carbs ? carbs.moderate.recommended : null}g</td>
                                <td>{fat ? fat.moderate.min : null}g - {fat ? fat.moderate.max : null}g</td>
                                <td>{fat ? fat.moderate.recommended : null}g</td>
                            </tr>
                            <tr>
                                <td>Hard</td>
                                <td>{calories ? calories.hard : null}</td>
                                <td>{protein ? protein.hard.min : null}g - {protein ? protein.hard.max : null}g</td>
                                <td>{protein ? protein.hard.recommended : null}g</td>
                                <td>{carbs ? carbs.hard.min : null}g - {carbs ? carbs.hard.max : null}g</td>
                                <td>{carbs ? carbs.hard.recommended : null}g</td>
                                <td>{fat ? fat.hard.min : null}g - {fat ? fat.hard.max : null}g</td>
                                <td>{fat ? fat.hard.recommended : null}g</td>
                            </tr>
                            <tr>
                                <td>Extra-hard</td>
                                <td>{calories ? calories.extraHard : null}</td>
                                <td>{protein ? protein.extraHard.min : null}g - {protein ? protein.extraHard.max : null}g</td>
                                <td>{protein ? protein.extraHard.recommended : null}g</td>
                                <td>{carbs ? carbs.extraHard.min : null}g - {carbs ? carbs.extraHard.max : null}g</td>
                                <td>{carbs ? carbs.extraHard.recommended : null}g</td>
                                <td>{fat ? fat.extraHard.min : null}g - {fat ? fat.extraHard.max : null}g</td>
                                <td>{fat ? fat.extraHard.recommended : null}g</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        );
    }
}


export default MacroTable