import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdHistory } from "react-icons/md";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import VideoCard, { VideoCardSkeleton } from "../components/VideoCard";
import "./Home.css";

const History = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user && !loading) {
        return (
            <motion.div
                className="home-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="empty-state" style={{ minHeight: "60vh" }}>
                    <MdHistory className="icon" />
                    <h3>Sign in to view watch history</h3>
                    <p>Your watched videos will appear here after you sign in.</p>
                    <Link to="/register" className="btn-primary">Sign in to continue</Link>
                </div>
            </motion.div>
        );
    }

    const fetchHistory = async () => {
        try {
            const res = await API.get("/users/history");
            setVideos(res.data.data || []);
        } catch {
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h2>Watch History</h2>

            {loading ? (
                <div className="video-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <VideoCardSkeleton key={i} />
                    ))}
                </div>
            ) : videos.length > 0 ? (
                <div className="video-grid">
                    {videos.map((video, i) => (
                        <VideoCard key={video?._id || i} video={video} index={i} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <MdHistory className="icon" />
                    <h3>No watch history</h3>
                    <p>Videos you watch will show up here</p>
                </div>
            )}
        </motion.div>
    );
};

export default History;
