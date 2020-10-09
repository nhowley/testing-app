import React, { Component } from "react";
import axios from "axios"

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

        return(
            <div >
               <h1>REACT REACHED</h1>
            </div>
        );
    }
}


export default App