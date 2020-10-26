import React, { Component } from "react";
// import '../css/dashboard.css'
import axios from "axios"
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MacroCalculator from "./Components/MacroCalculator";
import WeeklyReports from "./Components/WeeklyReports";
import MonthlyReports from "./Components/MonthlyReports";
import Login from "./Components/Login";

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
            // <BrowserRouter>
                <div className="App">
                    {/* <Navbar /> */}
                    {/* <Switch>
                        <Route path="/app/macro-calculator" component={MacroCalculator} />
                        <Route path="/app/reports/weekly'" component={WeeklyReports} />
                        <Route path="/app/reports/monthly'" component={MonthlyReports} />
                        <Route path="/app/login'" component={Login} />
                    </Switch> */}
                    <Login />
                </div>
            // </BrowserRouter> 
        );
    }
}


export default App