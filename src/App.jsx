import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import "./App.css";

import ExplodingKittens from './images/Explode.png'


function App() {
  const defaultGames = [
    {
      id: 1,
      name: "Exploding Kittens",
      players: "2-4",
      tags: "Cards, Funny, Family",
      image: ExplodingKittens,
    },
    {
      id: 2,
      name: "Risk",
      players: "2-6",
      tags: "Strategy, War",
      image: "/images/risk.png",
    },
    {
      id: 3,
      name: "Carcassonne",
      players: "2-5",
      tags: "Tile, Strategy",
      image: "/images/carcassonne.png",
    },
    {
      id: 4,
      name: "Ticket to Ride",
      players: "2-5",
      tags: "Travel, Strategy",
      image: "/images/ticket-to-ride.png",
    },
  ];

  const [games, setGames] = useState(() => {
    const storedGames = localStorage.getItem("boardGames");
    return storedGames ? JSON.parse(storedGames) : defaultGames;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [newGame, setNewGame] = useState({
    id: null,
    name: "",
    players: "",
    tags: "",
    image: "",
  });

  useEffect(() => {
    localStorage.setItem("boardGames", JSON.stringify(games));
  }, [games]);

  const openModal = (game = null) => {
    setEditingGame(game);
    setNewGame(game || {
      id: games.length + 1,
      name: "",
      players: "",
      tags: "",
      image: "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const saveGame = () => {
    if (editingGame) {
      setGames(games.map((g) => (g.id === editingGame.id ? newGame : g)));
    } else {
      setGames([...games, newGame]);
    }
    closeModal();
  };

  const deleteGame = (id) => {
    setGames(games.filter((game) => game.id !== id));
  };

  return (
    <div className="app">
      <h1>Board Game Collection</h1>
      <div className="game-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <img src={game.image} alt={game.name} className="game-image" />
            <div className="game-info">
              <span className="game-title">{game.name}</span>
              <div className="players">
                <span className="player-icon">👤</span> {game.players} Players
              </div>
            </div>
            <div className="game-actions">
              <button className="action-btn" onClick={() => openModal(game)}>
                <FaEdit />
              </button>
              <button className="action-btn" onClick={() => deleteGame(game.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button className="add-button" onClick={() => openModal()}>+</button>

      {/* Modal for Adding/Editing */}
      {modalOpen && (
        <div className="modal">
          <h3>{editingGame ? "Edit Game" : "Add Game"}</h3>
          <input type="text" placeholder="Game Name" value={newGame.name} onChange={(e) => setNewGame({ ...newGame, name: e.target.value })} />
          <input type="text" placeholder="Player Count (e.g., 2-4)" value={newGame.players} onChange={(e) => setNewGame({ ...newGame, players: e.target.value })} />
          <input type="text" placeholder="Tags (comma-separated)" value={newGame.tags} onChange={(e) => setNewGame({ ...newGame, tags: e.target.value })} />
          <input type="text" placeholder="Image URL" value={newGame.image} onChange={(e) => setNewGame({ ...newGame, image: e.target.value })} />
          <button className="save-btn" onClick={saveGame}>Save</button>
          <button className="cancel-btn" onClick={closeModal}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
