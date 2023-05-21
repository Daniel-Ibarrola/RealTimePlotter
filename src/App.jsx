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


const LinePlot = ({ socket, name, colors }) => {
    // console.log("LinePlot renders");
    const [plotData, setPlotData] = React.useState({
        data: [],
        index: 0,
    });

    React.useEffect(() => {
        // console.log("Adding listener");
        const messageListener = (event) => {
            const value = parseInt(event.data);
            addNewPoint(value);
        }
        socket.addEventListener("message", messageListener);
        return () => socket.removeEventListener("message", messageListener);
    }, []);

    const dataset = {
        labels,
        datasets: [
            {
                label: name,
                data: plotData.data,
                borderColor: colors.borderColor,
                backgroundColor: colors.backgroundColor,
            },
        ],
    };

    const addNewPoint = (value) => {
        setPlotData(prevPlotData => {
            if (prevPlotData.data.length < 10){
                return {
                    data: [...prevPlotData.data, value],
                    index: prevPlotData.index + 1,
                };
            }
            let currentIndex = prevPlotData.index;
            if (currentIndex >= 9){
                currentIndex = 0;
            }
            let copy = [...prevPlotData.data];
            copy[currentIndex] = value;
            return {
                data: copy,
                index: currentIndex + 1,
            };
        });
    };

    return (
        <Line data={dataset} options={options} />
    )
};

const Plotter = () => {
    console.log("Plotter Renders")
    const { readyState, getWebSocket } = useWebSocket("ws://localhost:8765", {
        onOpen: () => console.log("Socket opened"),
        onClose: () => console.log("Connection closed"),
        filter: (message) => false,  // prevent re-rendering after each message
        // shouldReconnect: (event) => true,
        // onMessage: (event) => addNewPoint(event.data),
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
                <Row>
                    <Col>
                        <LinePlot
                            socket={getWebSocket()}
                            name={"Chart 1"}
                            colors={{
                                "backgroundColor": 'rgba(203, 67, 53, 0.5)',
                                "borderColor": 'rgba(203, 67, 53, 0.5)',
                            }}
                        />
                    </Col>
                </Row>
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
