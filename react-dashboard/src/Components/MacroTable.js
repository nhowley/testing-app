import React, { Component } from "react";

class MacroTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            records: []
        }
    }

    render(){
        const { type, protein, carbs, fat, calories } = this.props
        console.log("type", type)
        console.log("protein", protein)
        console.log("calories", calories)
        return (
            <div className="macros mt-4">
                    <h3>Maintenance Macros - {type}</h3>
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