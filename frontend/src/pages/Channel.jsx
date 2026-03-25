import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import VideoCard, { VideoCardSkeleton } from "../components/VideoCard";
import toast from "react-hot-toast";
import "./Channel.css";
import "../pages/Home.css";

const Channel = () => {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [activeTab, setActiveTab] = useState("videos");
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        fetchChannel();
    }, [username]);

    const fetchChannel = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/users/c/${username}`);
            setChannel(res.data.data);
            setIsSubscribed(res.data.data.isSubscribed || false);
            // Fetch channel videos
            const vRes = await API.get("/videos", {
                params: { userId: res.data.data._id, limit: 20 },
            });
            setVideos(vRes.data.data.docs || vRes.data.data || []);
        } catch {
            toast.error("Channel not found");
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        if (!channel?._id) return;
        try {
            const res = await API.post(`/subscriptions/c/${channel._id}`);
            setIsSubscribed(res.data.data.isSubscribed);
            setChannel((prev) => ({
                ...prev,
                subscribersCount: prev.subscribersCount + (res.data.data.isSubscribed ? 1 : -1),
            }));
        } catch {
            toast.error("Please sign in");
        }
    };

    if (loading) {
        return (
            <div className="channel-page">
                <div className="channel-banner skeleton" />
                <div style={{ height: 120 }} />
                <div className="video-grid">
                    {Array.from({ length: 6 }).map((_, i) => <VideoCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    if (!channel) return <div className="empty-state"><h3>Channel not found</h3></div>;

    return (
        <motion.div
            className="channel-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="channel-banner">
                {channel.coverImage && <img src={channel.coverImage} alt="Banner" />}
            </div>

            <div className="channel-header">
                <div className="channel-avatar-large">
                    <img src={channel.avatar || "/default-avatar.png"} alt={channel.username} />
                </div>
                <div className="channel-meta">
                    <h1>{channel.fullName}</h1>
                    <p className="channel-handle">@{channel.username}</p>
                    <div className="channel-stats-row">
                        <span>{channel.subscribersCount?.toLocaleString() || 0} subscribers</span>
                        <span>{videos.length} videos</span>
                    </div>
                </div>
                {currentUser?.username !== channel.username && (
                    <motion.button
                        className={`subscribe-btn ${isSubscribed ? "subscribed" : "not-subscribed"}`}
                        onClick={handleSubscribe}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                    </motion.button>
                )}
            </div>

            <div className="channel-tabs">
                {["videos", "playlists"].map((tab) => (
                    <button
                        key={tab}
                        className={`channel-tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === "videos" && (
                <div className="video-grid">
                    {videos.length > 0 ? (
                        videos.map((video, i) => <VideoCard key={video._id} video={video} index={i} />)
                    ) : (
                        <div className="empty-state">
                            <h3>No videos yet</h3>
                            <p>This channel hasn't uploaded any videos.</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default Channel;
