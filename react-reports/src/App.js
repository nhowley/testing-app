import React, { Component } from "react";
import axios from "axios"
import json from "../../public/reports/daily.json";
import DayPicker from './Components/DayPicker'
import moment from 'moment'
import LineGraph from "./Components/LineGraph";
import PieChart from "./Components/PieChart";
import BarChart from "./Components/BarChart";
import { goalLabels, goalColours, goalTitle, workoutsLabels, workoutsColours, workoutsTitle } from './chartData'

import { occupancyDataMonth } from './MockData'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            JSONResults: json,
            showFilters: true,
            data: occupancyDataMonth,
            goals: [],
            goalsArrLength: [],
            datesFilled: [],
            hoursSleep: [],
            goalLabels: goalLabels,
            goalColours: goalColours,
            goalTitle: goalTitle,
            workoutsArrLength: [],
            feeling: []
        }
    }

    componentDidMount = () => {
        console.log("app loaded")
    }

    updateEmail = (e)=>{
        this.setState({
            email: e.target.value
        })
    }

    getClientResults = async (e) => {
        let allClientReports = await this.getClientReportsByEmail()
        let clientReportsInRange = await this.getClientReportsInRange(allClientReports)
        let datesArray = await this.datesArray(clientReportsInRange)
        let goals = await this.getGoals(clientReportsInRange)
        let goalsArrLength = await this.getGoalsFrequency(goals)
        this.getHoursSleep(clientReportsInRange)
        this.getWorkouts(clientReportsInRange)
        this.getFeeling(clientReportsInRange)
        let positives = this.getPositives(clientReportsInRange)
        let workoutComments = this.getWorkoutComments(clientReportsInRange)
        let additionalComments = this.getAdditionalComments(clientReportsInRange)

        this.setState({
            allClientReports: allClientReports,
            clientReportsInRange: clientReportsInRange,
            datesArray: datesArray,
            goals: goals,
            goalsArrLength: goalsArrLength,
            positives: positives,
            workoutComments: workoutComments,
            additionalComments: additionalComments
        }, () => {this.hideFilters()})
    }

    getClientReportsByEmail = () => {
        let email = this.state.email
        let dataArr = Object.entries(this.state.JSONResults)
        let newdataArr = {}
        let data = {}

        dataArr.forEach(([key, value], index) => {
            
            Object.entries(value).forEach(([key2, value2]) => {
                if (key2 === email){
                    data[index] = value2
                    newdataArr[key2] = data
                }
                console.log("data", data)
            })
        });

        return newdataArr
    }

    // gets all reports for client in date range selected
    getClientReportsInRange = (allClientReports) => {
        let reports = Object.values(allClientReports)
        console.log("reports", Object.values(reports))
        
        let reportsInDateRange = []

        Object.entries(reports).forEach(([number, report]) => {
           let reportArr = Object.values(report)
           reportsInDateRange = reportArr.filter(element => this.state.datesSelected.includes(moment(element).format("YYYY-MM-DD")));
            console.log("reportsInDateRange", reportsInDateRange)
        })

        return reportsInDateRange
    }

    datesArray = (data) => {
        console.log("datesArray reached")
        let dates = []
        Object.entries(data).forEach(([key, report]) =>{
            console.log("report", report)
            dates.push(report.dateofreview)
        })
        return dates
    }

    setDatesSelected = (from, to) => {
        if (from !== undefined && to !== undefined) {
            let datesSelected = this.getDateArray(from, to)
            this.setState({
                from: from,
                to: to,
                datesSelected: datesSelected
            })
        } else {
            this.setState({
                from: from,
                to: to
            })
        }
        
    }

    getDateArray = (start, end) => {
        var
          arr = new Array(),
          dt = new Date(start);
  
        while (dt <= end) {
          arr.push(moment(dt).format('YYYY-MM-DD'));
          dt.setDate(dt.getDate() + 1);
        }
        return arr;
      }

      getFeeling = (reports) => {
        let feeling = []

        reports.forEach(report =>{
            feeling.push(report.general)
        })
        
        this.setState({
            feeling: feeling
        })
      }

      getGoals = (reports) => {
        let goals = []
        reports.forEach(report => {
            let res = report.goal.charAt(0);
            goals.push(res)
        })
        console.log("goals", goals)
        return goals
      }

      getGoalsFrequency = (goals) => {
        let goalData = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        }

        goals.forEach(goal => {
            if(goal === "1"){
                goalData[1].push(goal)
            } else if(goal === "2"){
                goalData[2].push(goal)
            }
            else if(goal === "3"){
                goalData[3].push(goal)
            }
            else if(goal === "4"){
                goalData[4].push(goal)
            }
            else if(goal === "5"){
                goalData[5].push(goal)
            }
        })

        let goalsArrLength = []

        Object.entries(goalData).forEach(([key, value]) => {
            goalsArrLength.push(value.length)
        })

        return goalsArrLength
      }

      getHoursSleep = (reports) => {
          console.log("hours sleep reached")
        let dates = []
        let sleep = []

        reports.forEach(report =>{
            console.log("report", report)
            dates.push(report.dateofreview)
            sleep.push(report.hoursSleep)
        })
        
        this.setState({
            datesFilled: dates,
            hoursSleep: sleep
        })
      }

      getWorkouts = (reports) => {
        console.log("get workouts")
        let workouts = []

        reports.forEach(report =>{
            if(report.exerciseIntensity.includes("Rest day")){
                workouts.push("Rest")
            } else if(report.exerciseIntensity.includes("Light")){
                workouts.push("Light")
            } else if(report.exerciseIntensity.includes("Moderate")){
                workouts.push("Moderate")
            } else if(report.exerciseIntensity.includes("Hard")){
                workouts.push("Hard")
            }
        })

        this.setState({
            daysWorkouts: workouts.length
        })

        let workoutData = {
            Rest: [],
            Light: [],
            Moderate: [],
            Hard: []
        }

        workouts.forEach(workout => {
            if(workout === "Rest"){
                workoutData.Rest.push(workout)
            } else if(workout === "Light"){
                workoutData.Light.push(workout)
            }
            else if(workout === "Moderate"){
                workoutData.Moderate.push(workout)
            }
            else if(workout === "Hard"){
                workoutData.Hard.push(workout)
            }
        })
        let workoutsArrLength = []

        Object.entries(workoutData).forEach(([key, value]) => {
            workoutsArrLength.push(value.length)
        })

        this.setState({
            workoutsArrLength: workoutsArrLength
        })
      }
  
      getPositives = (reports) => {
        console.log("get positives")
        let positives= []
        reports.forEach(report => {
            positives.push([report.dateofreview, report.positives])
        })
        return positives
      }

      getWorkoutComments = (reports) => {
        console.log("get workout comments")
        let workoutComments= []
        reports.forEach(report => {
            workoutComments.push([report.dateofreview, report.additionalworkoutcomments])
        })
        return workoutComments
      }

      getAdditionalComments = (reports) => {
        console.log("get additional comments")
        let additionalComments= []
        reports.forEach(report => {
            additionalComments.push([report.dateofreview, report.anyadditionalcomments])
        })
        return additionalComments
      }

      hideFilters = () => {
          this.setState({
              showFilters: false
          })
      }

    render(){
        const { datesArray, data, goalsArrLength, datesFilled, hoursSleep, workoutsArrLength, positives, workoutComments, additionalComments, showFilters, from, to, email, feeling } = this.state
        let formatFrom= moment(from).format("DD-MM-YYYY")
        let formatTo= moment(to).format("DD-MM-YYYY")
        return(
            <div>
                {showFilters ? 
                <div>
                    <h1>Reports</h1>
                    <label htmlFor="email">Client email</label>
                    <br/>
                    <input type="email" onChange={(e) => {this.updateEmail(e)}} id="email"></input>
                    <DayPicker setDatesSelected={this.setDatesSelected}/>
                    <button onClick={() => {this.getClientResults()}}>Submit</button>
                </div>
                : null }
                {!showFilters ? 
                <h3 className="text-center mt-5 w-50 mx-auto">Report for {email} from {formatFrom} to {formatTo}</h3>
                : null}
                <h2 className="mt-5 mb-5 text-center">Stats</h2>
                <div className="d-flex justify-content-center">
                    <PieChart data={goalsArrLength} labels={goalLabels} colours={goalColours} title={goalTitle} id={"goalsChart"} width={"320"} height={"320"} displayLegend={true}/>
                    <LineGraph datesArray={datesArray} data={feeling} borderColor={"#3cba9f"} />
                </div>
                <div className="d-flex justify-content-center">
                    <BarChart datesFilled={datesFilled} hoursSleep={hoursSleep}/>
                    <PieChart data={workoutsArrLength} labels={workoutsLabels} colours={workoutsColours} title={workoutsTitle} id={"workoutsChart"} width={"300"} height={"300"}  displayLegend={true}/>
                </div>
                <h2 className="mb-5 mt-5 text-center pt-5">Comments</h2>
                <div className="d-flex justify-content-center">
                    <div className="positives p-4 bg-white">
                        <h3>Positives</h3>
                        {positives ? positives.map((positive, index) => 
                            <div key={index}>
                                <p className="mb-0 font-weight-bold small">{positive[0]}</p>
                                <p>{positive[1]}</p>
                            </div>
                        ) : null}
                    </div>

                    <div className="workout-comments p-4 bg-white">
                        <h3>Workout Comments</h3>
                        {workoutComments ? workoutComments.map((comment, index) => 
                            <div key={index}>
                                <p className="mb-0 font-weight-bold small">{comment[0]}</p>
                                <p>{comment[1]}</p>
                            </div>
                        ) : null}
                    </div>

                    <div className="additional-comments p-4 bg-white">
                        <h3>Additional Comments</h3>
                        {additionalComments ? additionalComments.map((comment, index) => 
                            <div key={index}>
                                <p className="mb-0 font-weight-bold small">{comment[0]}</p>
                                <p>{comment[1]}</p>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Goal - pie chart, feel - line graph , sleep - bar chart, workouts - list number of workout days and workout types - pie chart maybe?, list positives, list additional workout comments, list additional comments */}
            </div>
        );
    }
}


export default App