import React, { Component } from "react";
import { thisExpression } from "babel-types";

class TrainingDaySelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showSingle: false,
            showDouble: false
        }
    }

    showSingle = () => {
        console.log("single training day")
        this.setState({
            showSingle: true,
            showDouble:false,
            singleWorkout: true,
            doubleWorkout: false
        })
    }

    showDouble = () => {
        console.log("double training day")
        this.setState({
            showSingle: false,
            showDouble: true,
            doubleWorkout: true,
            singleWorkout: false
        })
    }

    setIntensity = (e,i) => {
        if(this.state.singleWorkout){
            this.setState({
                trainingIntensitySingle: e.target.id
            }, () => this.sendInfoToParent(i) )
        } else if (e.target.name.includes("workout-1")){
            this.setState({
                trainingIntensityW1: e.target.id,
                trainingIntensitySingle: null
            }, () => this.sendInfoToParent(i) )
        } else if (e.target.name.includes("workout-2")){
            this.setState({
                trainingIntensityW2: e.target.id,
                trainingIntensitySingle: null
            }, () => this.sendInfoToParent(i) )
        }   
    }

    setWorkoutType = (e,i) => {
        console.log("workout type reached")
        if(this.state.singleWorkout){
            this.setState({
                trainingTypeSingle: e.target.id
            }, () => this.sendInfoToParent(i) )
        } else if (e.target.name.includes("workout-1")){
            this.setState({
                trainingTypeW1: e.target.id,
                trainingTypeSingle: null
            }, () => this.sendInfoToParent(i) )
        } else if (e.target.name.includes("workout-2")){
            this.setState({
                trainingTypeW2: e.target.id,
                trainingTypeSingle: null
            }, () => this.sendInfoToParent(i) )
        }   
    }

    sendInfoToParent = (i) => {
        this.props.setInfoFromChild(i, this.state)
    }

    render(){
        const { i } = this.props
        return (
            <div>
                    <h5 className="mt-3">Day {i+1}</h5>
                    <input type="radio" name={`training-frequency-${i+1}`} id="single" onClick={this.showSingle}></input>
                    <label htmlFor="single" className="ml-1">Single training day</label>
                    <br/>
                    <input type="radio" name={`training-frequency-${i+1}`} id="double" onClick={this.showDouble}></input>
                    <label htmlFor="double" className="ml-1">Double training day</label>
                    <br/>
                    {this.state.showSingle ? 
                    <div>
                        <div className="mt-2 p-4">
                            <p>At what intensity is this training session?</p>
                            <input type="radio" name={`intensity-${i+1}`} id="light" onClick={(e)=> this.setIntensity(e,i)}></input>
                            <label htmlFor="light" className="ml-1">Light</label>
                            <br/>
                            <input type="radio" name={`intensity-${i+1}`} id="moderate" onClick={(e)=> this.setIntensity(e,i)}></input>
                            <label htmlFor="moderate" className="ml-1">Moderate</label>
                            <br/>
                            <input type="radio" name={`intensity-${i+1}`} id="hard" onClick={(e)=> this.setIntensity(e,i)}></input>
                            <label htmlFor="hard" className="ml-1">Hard</label>
                            <br/>
                        </div> 
                        <div className="mt-2 p-4">
                            <p>What kind of activity is this training session?</p>
                            <input type="radio" name={`training-type-${i+1}`} id="endurance" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="endurance" className="ml-1">Endurance(hiking, swimming, running, cycling)</label>
                            <br/>
                            <input type="radio" name={`training-type-${i+1}`} id="team" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="team" className="ml-1">Team sport</label>
                            <br/>
                            <input type="radio" name={`training-type-${i+1}`} id="strength" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="strength" className="ml-1">Strength and power</label>
                            <br/>
                            <input type="radio" name={`training-type-${i+1}`} id="other" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="other" className="ml-1">Other</label>
                        </div> 
                    </div>
                    : null}

                    {this.state.showDouble ?
                    <div className="mt-2 p-4">
                        <p>At what intensity are your training sessions?</p>
                        <div>
                            <p className="font-weight-bold mb-1">Workout 1</p>
                            <input type="radio" name={`intensity-${i+1}-workout-1`} id="light"  onClick={(e)=> this.setIntensity(e,i)}></input>
                            <label htmlFor="light" className="ml-1">Light</label>
                            <br/>
                            <input type="radio" name={`intensity-${i+1}-workout-1`}id="moderate" onClick={(e)=> this.setIntensity(e,i)}></input>
                            <label htmlFor="moderate" className="ml-1">Moderate</label>
                            <br/>
                            <input type="radio" name={`intensity-${i+1}-workout-1`}id="hard" onClick={(e)=> this.setIntensity(e,i)}></input>
                            <label htmlFor="hard" className="ml-1">Hard</label>
                            <br/>
                        </div>
                        
                        
                        <div>
                            <p className="mt-2 font-weight-bold mb-1">Workout 2</p>
                            <input type="radio" name={`intensity-${i+1}-workout-2`} id="light" onClick={(e)=> this.setIntensity(e,i)}></input>
                            <label htmlFor="light" className="ml-1">Light</label>
                            <br/>
                            <input type="radio" name={`intensity-${i+1}-workout-2`} id="moderate" onClick={(e)=> this.setIntensity(e,i)}></input>
                            <label htmlFor="moderate" className="ml-1">Moderate</label>
                            <br/>
                            <input type="radio" name={`intensity-${i+1}-workout-2`} id="hard" onClick={(e)=> this.setIntensity(e,i)}></input>
                            <label htmlFor="hard" className="ml-1">Hard</label>
                            <br/>
                        </div>
                        <p className="mt-4">What kind of activity is this training session?</p>

                        <div className="mt-4">
                            <p className="mt-2 font-weight-bold mb-1">Workout 1</p>
                            <input type="radio" name={`training-type-${i+1}-workout-1`} id="endurance" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="endurance" className="ml-1">Endurance(hiking, swimming, running, cycling)</label>
                            <br/>
                            <input type="radio" name={`training-type-${i+1}-workout-1`} id="team" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="team" className="ml-1">Team sport</label>
                            <br/>
                            <input type="radio" name={`training-type-${i+1}-workout-1`} id="strength" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="strength" className="ml-1">Strength and power</label>
                            <br/>
                            <input type="radio" name={`training-type-${i+1}-workout-1`} id="other" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="other" className="ml-1">Other</label>
                            <br/>
                        </div> 

                        <div className="mt-4">
                            <p className="mt-2 font-weight-bold mb-1">Workout 2</p>
                            <input type="radio" name={`training-type-${i+1}-workout-2`} id="endurance" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="endurance" className="ml-1">Endurance(hiking, swimming, running, cycling)</label>
                            <br/>
                            <input type="radio" name={`training-type-${i+1}-workout-2`} id="team" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="team" className="ml-1">Team sport</label>
                            <br/>
                            <input type="radio" name={`training-type-${i+1}-workout-2`} id="strength" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="strength" className="ml-1">Strength and power</label>
                            <br/>
                            <input type="radio" name={`training-type-${i+1}-workout-2`} id="other" onClick={(e)=> this.setWorkoutType(e,i)}></input>
                            <label htmlFor="other" className="ml-1">Other</label>
                            <br/>
                        </div> 


                    </div>
                    : null }
                </div>
                
        );
    }
}


export default TrainingDaySelect