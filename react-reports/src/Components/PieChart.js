import React, { Component } from 'react'
import Chart from "chart.js";

Chart.defaults.global.legend.display = false;

export default class LineGraph extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }
    
    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        
        new Chart(myChartRef, {
            type: 'pie',
            data: {
              labels: ["Didn't track", "Missed targets", "Hit calories only", "Hit calories and macros", "Hit calories and macros and quality food"],
              datasets: [{
                label: "Population (millions)",
                backgroundColor: ["#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f"],
                data: this.props.goalsArrLength
              }]
            },
            options: {
              title: {
                display: true,
                text: 'Targets'
              }
            }
        });
    }
    render() {
        return (
            <div className="mt-4">
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}