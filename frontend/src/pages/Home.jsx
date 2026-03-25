import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MdVideoLibrary } from "react-icons/md";
import API from "../api/axios";
import VideoCard, { VideoCardSkeleton } from "../components/VideoCard";
import "./Home.css";

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        fetchVideos();
    }, [searchQuery]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const params = { page: 1, limit: 20 };
            if (searchQuery) params.query = searchQuery;
            const res = await API.get("/videos", { params });
            setVideos(res.data.data.docs || res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch videos:", err);
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
            {searchQuery && (
                <h2>
                    Results for "<span className="gradient-text">{searchQuery}</span>"
                </h2>
            )}

            {loading ? (
                <div className="video-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <VideoCardSkeleton key={i} />
                    ))}
                </div>
            ) : videos.length > 0 ? (
                <div className="video-grid">
                    {videos.map((video, i) => (
                        <VideoCard key={video._id} video={video} index={i} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <MdVideoLibrary className="icon" />
                    <h3>{searchQuery ? "No results found" : "No videos yet"}</h3>
                    <p>
                        {searchQuery
                            ? "Try searching with different keywords"
                            : "Be the first to upload a video!"}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default Home;
