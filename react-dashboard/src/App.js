import React, { Component } from "react";
import '../css/dashboard.css'
import axios from "axios"
import MacroCalculator from "./Components/MacroCalculator";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cats: []
        }
    }

    componentDidMount = () => {
        console.log("app loaded")
    }



    render(){
        // const { cats } = this.state
        // let catsArr = []

        // for (let i = 0; i < cats.length; i++) {
        //     catsArr.push(<p key={i}>{cats[i].name} is {cats[i].age}</p>)
        //     console.log("cats", cats)
        // }

        return(
            <div >
               <MacroCalculator />
            </div>
        );
    }
}


export default App