# Real Time Plotter

A sample web app to plot data in real time. It consists of a server
that sends data to a client every 5 seconds. The server is written in Python and the client in JavaScript/React. 

## Installation

Tested in python 3.11.3 and Node v18.16.0

```bash 

    # Install client
    npm install

    # Install server
    cd server
    python -m venv venv
    source venv/bin/activate
    pip install -r requiremnts.txt  
    
```

## Running the app

```bash
  # Start server
  python server/server.py
  
  # Start client
  npm run dev
```
