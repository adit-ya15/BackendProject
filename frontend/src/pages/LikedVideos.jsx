import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdThumbUp } from "react-icons/md";
import API from "../api/axios";
import VideoCard, { VideoCardSkeleton } from "../components/VideoCard";
import "./Home.css";

const LikedVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLikedVideos();
    }, []);

    const fetchLikedVideos = async () => {
        try {
            const res = await API.get("/likes/videos");
            setVideos((res.data.data || []).map((item) => item.video));
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
            <h2>Liked Videos</h2>

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
                    <MdThumbUp className="icon" />
                    <h3>No liked videos</h3>
                    <p>Videos you like will show up here</p>
                </div>
            )}
        </motion.div>
    );
};

export default LikedVideos;
