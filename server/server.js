const { createServer } = require("http");
const { Server } = require("socket.io");

console.log("Hello World");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let playerScores = [];

io.on("connection", (socket) => {
  socket.on("scores", (scores) => {
    playerScores.push({ ...scores, id: socket.id });
    socket.emit("playerScores", playerScores);
  });

  socket.on("edit", (scoreToBeEdited) => {
    const indexToBeEdited = playerScores.findIndex(
      (scoreDetails) => scoreDetails.id === scoreToBeEdited.id
    );
    playerScores[indexToBeEdited] = { ...scoreToBeEdited };
    socket.emit("playerScores", playerScores);
  });

  socket.on("delete", (id) => {
    const updatedPlayerScores = playerScores.filter(
      (scoreDetails) => scoreDetails.id !== id
    );
    playerScores = updatedPlayerScores;
    socket.emit("playerScores", playerScores);
  });
  socket.emit("playerScores", playerScores);
  setInterval(() => {
    socket.emit("playerScores", playerScores);
  }, 5000);
});

httpServer.listen(3000, () => {
  console.log(`Server running at port 3000`);
});
