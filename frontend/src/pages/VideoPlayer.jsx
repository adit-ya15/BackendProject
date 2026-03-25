import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdThumbUp, MdThumbUpOffAlt, MdSend } from "react-icons/md";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./VideoPlayer.css";

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
    ];
    for (const i of intervals) {
        const count = Math.floor(seconds / i.seconds);
        if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
    }
    return "just now";
};

const VideoPlayer = () => {
    const { videoId } = useParams();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        fetchVideo();
        fetchComments();
    }, [videoId]);

    const fetchVideo = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/videos/${videoId}`);
            const v = res.data.data;
            setVideo(v);
            setIsLiked(v.isLiked || false);
            setLikesCount(v.likesCount || 0);
            setIsSubscribed(v.owner?.isSubscribed || false);
        } catch (err) {
            toast.error("Failed to load video");
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await API.get(`/comments/${videoId}`);
            setComments(res.data.data.docs || res.data.data || []);
        } catch { /* ignore */ }
    };

    const handleLike = async () => {
        try {
            const res = await API.post(`/likes/toggle/v/${videoId}`);
            setIsLiked(res.data.data.isLiked);
            setLikesCount((prev) => (res.data.data.isLiked ? prev + 1 : prev - 1));
        } catch {
            toast.error("Please sign in to like");
        }
    };

    const handleSubscribe = async () => {
        if (!video?.owner?._id) return;
        try {
            const res = await API.post(`/subscriptions/c/${video.owner._id}`);
            setIsSubscribed(res.data.data.isSubscribed);
            toast.success(res.data.data.isSubscribed ? "Subscribed!" : "Unsubscribed");
        } catch {
            toast.error("Please sign in");
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await API.post(`/comments/${videoId}`, { content: newComment });
            setNewComment("");
            fetchComments();
            toast.success("Comment added!");
        } catch {
            toast.error("Failed to add comment");
        }
    };

    if (loading) {
        return (
            <div className="video-page">
                <div className="video-player-section">
                    <div className="video-player-wrapper skeleton" />
                    <div className="skeleton" style={{ height: 24, width: "70%" }} />
                    <div className="skeleton" style={{ height: 16, width: "40%" }} />
                </div>
            </div>
        );
    }

    if (!video) return <div className="empty-state"><h3>Video not found</h3></div>;

    return (
        <motion.div
            className="video-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="video-player-section">
                <div className="video-player-wrapper">
                    <video src={video.videoFile} controls autoPlay />
                </div>

                <div className="video-info-section">
                    <h1 className="video-title-large">{video.title}</h1>

                    <div className="video-actions-row">
                        <div className="video-owner-info">
                            <Link to={`/channel/${video.owner?.username}`} className="video-owner-avatar">
                                <img src={video.owner?.avatar || "/default-avatar.png"} alt="" />
                            </Link>
                            <div className="video-owner-details">
                                <h4>{video.owner?.fullName}</h4>
                                <p>{video.owner?.subscribersCount || 0} subscribers</p>
                            </div>
                            <motion.button
                                className={`subscribe-btn ${isSubscribed ? "subscribed" : "not-subscribed"}`}
                                onClick={handleSubscribe}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isSubscribed ? "Subscribed" : "Subscribe"}
                            </motion.button>
                        </div>

                        <div className="video-action-buttons">
                            <motion.button
                                className={`action-btn ${isLiked ? "active" : ""}`}
                                onClick={handleLike}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isLiked ? <MdThumbUp className="icon" /> : <MdThumbUpOffAlt className="icon" />}
                                {likesCount}
                            </motion.button>
                        </div>
                    </div>

                    <div className="video-description">
                        <div className="meta">
                            {video.views?.toLocaleString()} views • {timeAgo(video.createdAt)}
                        </div>
                        {video.description}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="comments-section">
                    <h3 className="comments-header">{comments.length} Comments</h3>

                    {user && (
                        <form className="comment-input-box" onSubmit={handleComment}>
                            <input
                                className="input-field"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <motion.button
                                type="submit"
                                className="btn-primary"
                                whileTap={{ scale: 0.95 }}
                                style={{ padding: "12px 16px" }}
                            >
                                <MdSend />
                            </motion.button>
                        </form>
                    )}

                    {comments.map((comment, i) => (
                        <motion.div
                            key={comment._id}
                            className="comment-item"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                        >
                            <div className="comment-avatar">
                                <img src={comment.owner?.avatar || "/default-avatar.png"} alt="" />
                            </div>
                            <div className="comment-body">
                                <div className="comment-author">
                                    {comment.owner?.fullName || comment.owner?.username}
                                    <span>{timeAgo(comment.createdAt)}</span>
                                </div>
                                <p className="comment-text">{comment.content}</p>
                                <div className="comment-actions">
                                    <button className={`action-btn ${comment.isLiked ? "active" : ""}`} style={{ padding: "4px 10px", fontSize: "0.8rem" }}>
                                        {comment.isLiked ? <MdThumbUp /> : <MdThumbUpOffAlt />}
                                        {comment.likesCount || 0}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Related Videos */}
            <div className="related-section">
                <h3>Related Videos</h3>
                {/* Placeholder — related videos would be fetched separately */}
                <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem" }}>
                    More videos coming soon...
                </p>
            </div>
        </motion.div>
    );
};

export default VideoPlayer;
