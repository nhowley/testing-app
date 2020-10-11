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
            labels: this.props.datesFilled,
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
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            stepSize: 0.5,
                            min: 0,

                        }
                    }]
                }
            }
        });
    }
    render() {
        return (
            <div className="mt-4 bg-white p-4">
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                    width="400px"
                    height="300px"
                />
            </div>
        )
    }
}