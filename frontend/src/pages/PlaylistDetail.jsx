import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdPlaylistPlay } from "react-icons/md";
import API from "../api/axios";
import VideoCard, { VideoCardSkeleton } from "../components/VideoCard";
import toast from "react-hot-toast";
import "./Home.css";

const PlaylistDetail = () => {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlaylist();
    }, [playlistId]);

    const fetchPlaylist = async () => {
        try {
            const res = await API.get(`/playlist/${playlistId}`);
            setPlaylist(res.data.data);
        } catch {
            toast.error("Playlist not found");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="home-page">
                <div className="skeleton" style={{ height: 24, width: "40%", marginBottom: 24 }} />
                <div className="video-grid">
                    {Array.from({ length: 4 }).map((_, i) => <VideoCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    if (!playlist) return <div className="empty-state"><h3>Playlist not found</h3></div>;

    return (
        <motion.div
            className="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div style={{ marginBottom: "var(--space-lg)" }}>
                <h2>{playlist.name}</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
                    {playlist.description} • {playlist.totalVideos} videos • {playlist.totalViews?.toLocaleString()} views
                </p>
                {playlist.owner && (
                    <Link
                        to={`/channel/${playlist.owner.username}`}
                        style={{ fontSize: "0.85rem", color: "var(--accent-primary)", marginTop: 4, display: "inline-block" }}
                    >
                        by {playlist.owner.fullName}
                    </Link>
                )}
            </div>

            {playlist.videos?.length > 0 ? (
                <div className="video-grid">
                    {playlist.videos.map((video, i) => (
                        <VideoCard key={video._id} video={video} index={i} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <MdPlaylistPlay className="icon" />
                    <h3>Playlist is empty</h3>
                    <p>Add some videos to this playlist</p>
                </div>
            )}
        </motion.div>
    );
};

export default PlaylistDetail;
