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
            type: 'bar',
            data: {
            labels: this.props.datesSleep,
            datasets: [
                {
                label: "Hours of Sleep",
                backgroundColor: "#3e95cd",
                data: this.props.hoursSleep
                }
            ]
            },
            options: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Hours of Sleep this week'
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