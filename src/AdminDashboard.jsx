import React, { useState, useEffect } from "react";
import { db, storage, gamesCollection } from "./firebaseConfig";
import {
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: "",
    players: "",
    image: null,
  });

  const fetchGames = async () => {
    const snapshot = await getDocs(gamesCollection);
    setGames(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const addGame = async () => {
    if (!form.name || !form.description || !form.tags || !form.players || !form.image) return;

    const imageRef = ref(storage, `games/${form.image.name}`);
    await uploadBytes(imageRef, form.image);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(gamesCollection, { ...form, image: imageUrl });
    fetchGames();
  };

  const updateGame = async (id) => {
    const gameDoc = doc(db, "boardgames", id);
    await updateDoc(gameDoc, { name: form.name, description: form.description, tags: form.tags, players: form.players });
    fetchGames();
  };

  const deleteGame = async (id) => {
    await deleteDoc(doc(db, "boardgames", id));
    fetchGames();
  };

  return (
    <div className="admin-container">
      <h1>Spilcafeen Admin</h1>
      <div className="form-container">
        <input type="text" name="name" placeholder="Game Name" onChange={handleInputChange} />
        <textarea name="description" placeholder="Short Description" onChange={handleInputChange}></textarea>
        <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleInputChange} />
        <input type="number" name="players" placeholder="Player Count" onChange={handleInputChange} />
        <input type="file" onChange={handleImageChange} />
        <button onClick={addGame}>Add Game</button>
      </div>

      <div className="games-list">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <img src={game.image} alt={game.name} />
            <h3>{game.name}</h3>
            <p>{game.description}</p>
            <p><strong>Players:</strong> {game.players}</p>
            <p><strong>Tags:</strong> {game.tags}</p>
            <button onClick={() => updateGame(game.id)}>Edit</button>
            <button onClick={() => deleteGame(game.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
