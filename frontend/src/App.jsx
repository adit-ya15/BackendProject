import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import Dashboard from "./pages/Dashboard";
import Tweets from "./pages/Tweets";
import LikedVideos from "./pages/LikedVideos";
import History from "./pages/History";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: "#1a1a2e",
                            color: "#f1f1f1",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "10px",
                        },
                    }}
                />
                <AnimatePresence mode="wait">
                    <Routes>
                        {/* Auth - no sidebar/header */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* App shell with sidebar + header */}
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/video/:videoId" element={<VideoPlayer />} />
                            <Route path="/channel/:username" element={<Channel />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/my-content" element={<Dashboard />} />
                            <Route path="/tweets" element={<Tweets />} />
                            <Route path="/liked-videos" element={<LikedVideos />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/playlists" element={<Playlists />} />
                            <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
                        </Route>
                    </Routes>
                </AnimatePresence>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
