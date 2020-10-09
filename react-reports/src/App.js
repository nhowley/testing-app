import React, { Component } from "react";
import axios from "axios"
import json from "../../public/reports/daily.json";

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

    getClientResults = (e) => {
        console.log("time to get some results for", this.state.email)
        let email = this.state.email

        let dataArr = Object.entries(this.state.JSONResults)
        console.log("dataArr", dataArr)
        let newdataArr = {}
        let data = {}
        // let data = []
        dataArr.forEach(([key, value], index) => {
            console.log("key", value)
            
            Object.entries(value).forEach(([key2, value2]) => {
                console.log("key2", key2)
                if (key2 === email){
                    data[index] = value2
                    newdataArr[key2] = data
                }
                console.log("data", data)
                // data.push(value2)
            })
        });
        console.log("newDataArr", newdataArr)
        let datesArray = this.datesArray(newdataArr[email])
        console.log("datesArray", datesArray)
        this.setState({
            clientReports: newdataArr,
            datesArray: datesArray
        })
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

    render(){

        return(
            <div >
                <label htmlFor="email">Client email</label>
                <br/>
               <input type="email" onChange={(e) => {this.updateEmail(e)}} id="email"></input>
               <button onClick={() => {this.getClientResults()}}>Submit</button>
            </div>
        );
    }
}


export default App