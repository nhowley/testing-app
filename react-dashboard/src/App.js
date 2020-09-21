import React, { Component } from "react";
import '../css/dashboard.css'
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
        this.getCats()
    }

    getCats = async () => {
        axios.get(`/cats`)
            .then((res) => {
                this.setState({ 
                    cats: res.data
                })
                
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render(){
        const { cats } = this.state
        let catsArr = []

        for (let i = 0; i < cats.length; i++) {
            catsArr.push(<p key={i}>{cats[i].name} is {cats[i].age}</p>)
            console.log("cats", cats)
        }

        return(
            <div >
               <h1>CATS</h1>
               {catsArr}
            </div>
        );
    }
}


export default App