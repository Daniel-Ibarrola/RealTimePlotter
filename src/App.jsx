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
import useWebSocket, { ReadyState } from "react-use-websocket";
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


const Plotter = () => {
    console.log("Plot Renders")

    const [plotData, setPlotData] = React.useState({
        data: [],
        index: 0,
    });

    const { readyState } = useWebSocket("ws://localhost:8765", {
        onOpen: () => console.log("Socket opened"),
        onClose: () => console.log("Connection closed"),
        // shouldReconnect: (event) => true,
        onMessage: (event) => addNewPoint(event.data),
    });

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    console.log(`Connection status ${connectionStatus}`);

    const dataset = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: plotData.data,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const addNewPoint = (value) => {
        if (plotData.data.length < 10){
            setPlotData({
                data: [...plotData.data, value],
                index: plotData.index + 1,
            });
        }
        else {
            let currentIndex = plotData.index;
            if (plotData.index >= 9){
                currentIndex = 0;
            }
            let copy = [...plotData.data];
            copy[plotData.index] = value;
            setPlotData({
                data: copy,
                index: currentIndex + 1,
            });
        }
    };

    return (
        <>
            <Line data={dataset} options={options} />
        </>
    )

};

const App = () => {
    console.log("App Renders");
    // socket.addEventListener("message", (event) => {
    //             const value = parseInt(event.data);
    //             addNewPoint(value);
    //         });

    return (
        <>
          <h1>Hello World</h1>
            <Plotter />
        </>
  )
}

export default App
