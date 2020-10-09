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
        // this.getJSONResults()
    }

    getJSONResults = () => {
        let dataArr = Object.entries(json)
        console.log("dataArr", dataArr)
        let newdataArr = {}
        
        // let data = []
        dataArr.forEach(([key, value]) => {
            console.log("key", value)
            let data = {}
            Object.entries(value).forEach(([key2, value2], index) => {
                console.log("key2", key2)
                if(Object.keys(data).length === 0){
                    console.log("empty")
                    data[index] = value2
                } else {
                    let newIndex = index + 1
                    console.log("newIndex", newIndex)
                    data[newIndex] = value2
                }
                console.log("data", data)
                
                // data.push(value2)
                newdataArr[key2] = data
            })
            
        });
        console.log("newDataArr", newdataArr)
        this.setState({
            JSONResults: newdataArr
        })
    }

    updateEmail = (e)=>{
        this.setState({
            email: e.target.value
        })
    }

    getClientResults = (e) => {
        console.log("time to get some results for", this.state.email)
    }

    render(){

        return(
            <div >
               <h1>REACT REACHED</h1>
               <input type="email" onChange={(e) => {this.updateEmail(e)}}></input>
               <button onClick={() => {this.getClientResults()}}>Submit</button>
            </div>
        );
    }
}


export default App