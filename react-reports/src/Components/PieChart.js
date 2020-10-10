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
              labels: this.props.labels,
              datasets: [{
                label: this.props.title,
                backgroundColor: this.props.colours,
                data: this.props.data
              }]
            },
            options: {
              title: {
                display: true,
                text: this.props.title
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