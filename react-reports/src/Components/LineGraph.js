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
                        data: [4, 5, 4],
                        borderColor: this.props.borderColor
                    }
                ]
            },
            options: {

                //Customize chart options
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