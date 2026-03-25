import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdPlaylistPlay, MdAdd } from "react-icons/md";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Playlists.css";

const Playlists = () => {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", description: "" });

    useEffect(() => {
        if (user) fetchPlaylists();
    }, [user]);

    const fetchPlaylists = async () => {
        try {
            const res = await API.get(`/playlist/user/${user._id}`);
            setPlaylists(res.data.data || []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.name || !form.description) return;
        try {
            await API.post("/playlist", form);
            setForm({ name: "", description: "" });
            setShowForm(false);
            fetchPlaylists();
            toast.success("Playlist created!");
        } catch {
            toast.error("Failed to create playlist");
        }
    };

    return (
        <motion.div
            className="playlists-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-lg)" }}>
                <h1>My Playlists</h1>
                <motion.button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    whileTap={{ scale: 0.95 }}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                    <MdAdd /> New Playlist
                </motion.button>
            </div>

            {showForm && (
                <motion.form
                    className="create-playlist-form"
                    onSubmit={handleCreate}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                >
                    <div className="form-group">
                        <input
                            className="input-field"
                            placeholder="Playlist name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="input-field"
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap" }}>Create</button>
                </motion.form>
            )}

            {loading ? (
                <div className="playlists-grid">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="playlist-card">
                            <div className="playlist-card-thumb skeleton" />
                            <div className="playlist-card-info">
                                <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 8 }} />
                                <div className="skeleton" style={{ height: 12, width: "40%" }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : playlists.length > 0 ? (
                <div className="playlists-grid">
                    {playlists.map((playlist, i) => (
                        <motion.div
                            key={playlist._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <Link to={`/playlist/${playlist._id}`} className="playlist-card">
                                <div className="playlist-card-thumb">
                                    <MdPlaylistPlay size={48} color="white" />
                                    <div className="overlay">
                                        {playlist.totalVideos || 0} videos
                                    </div>
                                </div>
                                <div className="playlist-card-info">
                                    <h3>{playlist.name}</h3>
                                    <p>{playlist.totalViews?.toLocaleString() || 0} views • {playlist.description}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <MdPlaylistPlay className="icon" />
                    <h3>No playlists yet</h3>
                    <p>Create a playlist to organize your favorite videos</p>
                </div>
            )}
        </motion.div>
    );
};

export default Playlists;
