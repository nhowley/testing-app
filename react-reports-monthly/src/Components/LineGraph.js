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
            type: "line",
            data: {
                //Bring in data
                labels: this.props.datesArray,
                datasets: [
                    {
                        label: "Feeling",
                        data: this.props.data,
                        fill: false,
                        borderColor: this.props.borderColor
                    }
                ]
            },
            options: {

                legend: { display: false },
                title: {
                    display: true,
                    text: 'General feeling'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            stepSize: 1,
                            min: 0,
                            max: 5
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