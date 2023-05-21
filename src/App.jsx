import * as React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Line Chart',
        },
    },
};


const socket = new WebSocket("ws://localhost:8765");

socket.addEventListener("open", (event) => {
    console.log("Connection successful!");
});

const Plot = () => {
    console.log("Plot Renders")

    const [data, setData] = React.useState([1, ]);
    const [index, setIndex] = React.useState(0);

    const dataset = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: data,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    }

    const addNewPoint = (value) => {
        if (data.length < 10){
            setData([...data, value]);
        }
        else {
            let copy = [...data];
            copy[index] = value;
            setData(copy);
        }
        setIndex(index + 1);
        if (index === 9){
            setIndex(0);
        }
    };

    socket.addEventListener("message", (event) => {
        const value = parseInt(event.data);
        addNewPoint(value);
    });

    return (
        <>
            <Line data={dataset} options={options} />
        </>
    )

};

const App = () => {
    console.log("App Renders");
    return (
        <>
          <h1>Hello World</h1>
            <Plot />
            {/*<button onClick={addNewPoint}>*/}
            {/*    Add Point*/}
            {/*</button>*/}
        </>
  )
}

export default App
