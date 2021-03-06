import React, { Component } from "react";
import axios from "axios"
import json from "../../public/reports/weekly.json";
import DayPicker from './Components/DayPicker'
import moment from 'moment'
import LineGraph from "./Components/LineGraph";
import PieChart from "./Components/PieChart";
import BarChart from "./Components/BarChart";

import { occupancyDataMonth } from './MockData'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            JSONResults: json,
            showFilters: true,
            data: occupancyDataMonth,
            datesFilled: []
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
        let positives = this.getPositives(clientReportsInRange)
        let struggles = this.getStruggles(clientReportsInRange)
        this.getWeight(clientReportsInRange)
        this.getBodyFatPercentage(clientReportsInRange)

        this.setState({
            allClientReports: allClientReports,
            clientReportsInRange: clientReportsInRange,
            datesArray: datesArray,
            positives: positives,
            struggles: struggles
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

      getBodyFatPercentage = (reports) => {
        let bodyFat= []
        reports.forEach(report => {
            // WOMEN - Body density = (0,29669 x sum of all the skinfolds) – (0,00043 x sum of all of skinfolds squared) + (0,02963 x age) + 1,4072
            // MEN - Body density = (0,29288 x sum of all the skinfolds) – (0,0005 x sum of all of skinfolds squared) + (0,15845 x age) – 5.76377
            // Body Fat Percentage (%) = [(495 / Body Density) – 450] x 100
            let sumSkinFolds = Number(report.thigh) + Number(report.tricep) + Number(report.suprailiac) + Number(report.abdominal)
            console.log("sumSkinFolds", sumSkinFolds)
            let skinFoldsSquared = sumSkinFolds * sumSkinFolds
            console.log("skinFoldsAquare", skinFoldsSquared)
            let bodyFatPercentage = ''
            if (report.sex === "Female") {
                bodyFatPercentage = (0.29669 * sumSkinFolds) - (0.00043 * skinFoldsSquared) + (0.02963 * Number(report.age)) + 1.4072
            } else {
                bodyFatPercentage = (0.29288 * sumSkinFolds) - (0.0005  * skinFoldsSquared) + (0.15845 * Number(report.age)) - 5.76377
            }
            // console.log("bpdy Density", bodyDensity)
            // let bodyFatPercentage = (495 / bodyDensity) - 450
            bodyFat.push(bodyFatPercentage.toFixed(2))
        })
        this.setState({
            bodyFatPercentage: bodyFat
        })
      }

      getWeight = (reports) => {
        let weight= []
        let dates = []
        reports.forEach(report => {
            dates.push(report.dateofreview)
            weight.push(report.weightkg)
        })
        this.setState({
            weight: weight,
            datesFilled: dates
        })
      }
      
      getPositives = (reports) => {
          
        let positives= []
        reports.forEach(report => {
            positives.push([report.dateofreview, report.positives])
        })
        return positives
      }

      getStruggles = (reports) => {
        let struggles= []
        reports.forEach(report => {
            struggles.push([report.dateofreview, report.struggles])
        })
        return struggles
      }

      hideFilters = () => {
          this.setState({
              showFilters: false
          })
      }

    render(){
        const { positives, struggles, showFilters, from, to, email, datesFilled, weight, bodyFatPercentage } = this.state
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
                <p className="text-center mt-5 w-50 mx-auto font-weight-bold">Report for {email} from {formatFrom} to {formatTo}</p>
                : null}
                <h2 className="mt-2 mb-2 text-center">Stats</h2>
                {/* Weight and body fat in line graph - need to calc body fat from skinfolds, display positives and struggles as lists */}
                <div className="d-flex justify-content-center">
                    <LineGraph datesArray={datesFilled} data={weight} borderColor={"#3cba9f"} title={"Body Weight (kgs)"}/>
                    <LineGraph datesArray={datesFilled} data={bodyFatPercentage} borderColor={"#3cba9f"} title={"Body Fat Percentage"}/>
                </div>
                <h2 className="mb-2 mt-2 text-center pt-5">Comments</h2>
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
                    <div className="struggles p-4 bg-white">
                        <h3>Struggles</h3>
                        {struggles ? struggles.map((struggle, index) => 
                            <div key={index}>
                                <p className="mb-0 font-weight-bold small">{struggle[0]}</p>
                                <p>{struggle[1]}</p>
                            </div>
                        ) : null}
                    </div>

                </div>
            </div>
        );
    }
}


export default App