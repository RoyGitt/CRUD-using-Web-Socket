import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [scoreDetails, setScoreDetails] = useState({
    username: "",
    score: "",
  });

  const [allScores, setAllScores] = useState([]);

  const [startEdit, setStartEdit] = useState(false);

  const socket = io("http://localhost:3000");

  const connectToSocket = () => {
    socket.on("connection", (socket) => {
      console.log(socket);
    });
  };

  useEffect(() => {
    connectToSocket();
  }, []);

  useEffect(() => {
    socket.on("playerScores", (playerScores) => {
      setAllScores(playerScores);
    });
  }, []);

  const handleChange = (e) => {
    setScoreDetails((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("scores", { ...scoreDetails, id: uuidv4() });

    socket.on("playerScores", (playerScores) => {
      setAllScores(playerScores);
    });

    setScoreDetails({
      username: "",
      score: "",
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();

    socket.emit("edit", scoreDetails);
    socket.on("playerScores", (playerScores) => {
      setAllScores(playerScores);
    });
    setScoreDetails({
      id: "",
      username: "",
      score: "",
    });
    setStartEdit(false);
  };

  const handleDelete = (id) => {
    socket.emit("delete", id);
    socket.on("playerScores", (playerScores) => {
      setAllScores(playerScores);
    });
  };

  return (
    <main className="container">
      <form
        className="form"
        onSubmit={(e) => {
          if (startEdit) {
            handleEdit(e);
          } else {
            handleSubmit(e);
          }
        }}
      >
        <div>
          <label>Username</label>
          <input
            type="text"
            className="input"
            id="username"
            onChange={handleChange}
            value={scoreDetails.username}
          />
        </div>
        <div>
          {" "}
          <label>Score</label>
          <input
            type="number"
            className="input"
            id="score"
            onChange={handleChange}
            value={scoreDetails.score}
          />
        </div>

        <button> {startEdit ? "Edit" : "Submit"}</button>
      </form>
      <div>
        <h1>Leaderboards</h1>
        <table>
          <tr>
            <th>Username</th>
            <th>Score</th>
          </tr>
          {allScores.map((details) => (
            <tr>
              <td>{details.username}</td>
              <td>{details.score}</td>
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() => {
                    setStartEdit(true);
                    setScoreDetails(details);
                  }}
                >
                  Edit
                </button>
              </td>
              <td style={{ textAlign: "center" }}>
                <button type="button" onClick={() => handleDelete(details.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </main>
  );
}

export default App;
