import React, { Component } from "react";
import axios from "axios"
import json from "../../public/reports/daily.json";
import DayPicker from './Components/DayPicker'
import moment from 'moment'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            JSONResults: json
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
        
         // let datesArray = this.datesArray(newdataArr[email])

        this.setState({
            allClientReports: allClientReports,
            clientReportsInRange: clientReportsInRange
            // datesArray: datesArray
        })

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
  

    render(){

        return(
            <div >
                <label htmlFor="email">Client email</label>
                <br/>
               <input type="email" onChange={(e) => {this.updateEmail(e)}} id="email"></input>
               <DayPicker setDatesSelected={this.setDatesSelected}/>
               <button onClick={() => {this.getClientResults()}}>Submit</button>
            </div>
        );
    }
}


export default App