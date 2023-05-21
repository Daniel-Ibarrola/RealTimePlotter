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
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


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


const LineCharts = ({ socket }) => {
    const [plotData, setPlotData] = React.useState({
        data: {
            first: [],
            second: [],
            third: [],
        },
        index: 0,
    });

    React.useEffect(() => {
        const messageListener = (event) => {
            addNewPoint(event.data);
        }
        socket.addEventListener("message", messageListener);
        return () => socket.removeEventListener("message", messageListener);
    }, []);

    const chartsDataSets = [
        {
            labels,
            datasets: [
                {
                    label: "Chart 1",
                    data: plotData.data.first,
                    borderColor: 'rgb(203, 67, 53)',
                    backgroundColor: 'rgba(203, 67, 53, 0.5)',
                },
            ],
        },
        {
            labels,
            datasets: [
                {
                    label: "Chart 2",
                    data: plotData.data.second,
                    borderColor: 'rgb(36, 113, 163)',
                    backgroundColor: 'rgba(36, 113, 163, 0.5)',
                },
            ],
        },
        {
            labels,
            datasets: [
                {
                    label: "Chart 3",
                    data: plotData.data.third,
                    borderColor: 'rgb(40, 180, 99)',
                    backgroundColor: 'rgba(40, 180, 99, 0.2)',
                },
            ],
        },
    ];

    const addNewPoint = (value) => {
        // Add a point to each of the charts
        const points = value.split(",");

        setPlotData(prevPlotData => {
            if (prevPlotData.data.length < 10){
                return {
                    data: {
                        first: [...prevPlotData.data.first, parseInt(points[0])],
                        second: [...prevPlotData.data.second, parseInt(points[1])],
                        third: [...prevPlotData.data.third, parseInt(points[2])],
                    },
                    index: prevPlotData.index + 1,
                };
            } else {
                let currentIndex = prevPlotData.index;
                if (currentIndex >= 9){
                    currentIndex = 0;
                }
                let copy = {
                    first: [...prevPlotData.data.first],
                    second: [...prevPlotData.data.second],
                    third: [...prevPlotData.data.third],
                };
                copy.first[currentIndex] = points[0];
                copy.second[currentIndex] = points[1];
                copy.third[currentIndex] = points[2];
                return {
                    data: copy,
                    index: currentIndex + 1,
                };
            }
        });
    };

    return (
        <>
            <Row>
                <Col>
                    <Line data={chartsDataSets[0]} options={options} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Line data={chartsDataSets[1]} options={options} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Line data={chartsDataSets[2]} options={options} />
                </Col>
            </Row>
        </>
    )
};

const Plotter = () => {
    console.log("Plotter Renders")
    const { readyState, getWebSocket } = useWebSocket("ws://localhost:8765", {
        onOpen: () => console.log("Socket opened"),
        onClose: () => console.log("Connection closed"),
        filter: (message) => false,  // prevent re-rendering after each message
        // shouldReconnect: (event) => true,
    });

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    console.log(`Connection status ${connectionStatus}`);

    return (
        <Container>
            {
                connectionStatus === "Open" &&
                <LineCharts socket={getWebSocket()}/>
            }
        </Container>
    )

};

const App = () => {
    console.log("App Renders");
    return (
        <>
            <h1>Real Time Plotter</h1>
            <Plotter />
        </>
  )
}

export default App
