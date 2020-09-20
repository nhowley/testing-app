import React, { Component } from "react";
import '../css/dashboard.css'
import axios from "axios"
const { DateTime } = require("luxon");

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cats: []
        }
    }

    componentDidMount = () => {
        console.log("app loaded")
        this.getCats()
    }

    getCats = async () => {
        fetch( '/cats', { mode: 'cors' })
        .then(res => res.json())
        .then((data) => {
            this.setState({ 
                    cats: data
                })
            console.log("cats", data)
        })
        .catch(console.log)
    }

    render(){
        const { cats } = this.state

        return(
            <div >
               <h1>CATS</h1>
               {cats.forEach(cat => {
                   <p>{cat.name} is {cat.age}</p>
                   console.log(`${cat.name} is ${cat.age}`)
                })}
        </div>
        );
    }
}


export default App