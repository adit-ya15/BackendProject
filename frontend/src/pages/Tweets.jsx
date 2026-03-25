import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdThumbUp, MdThumbUpOffAlt, MdDelete, MdChat } from "react-icons/md";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Tweets.css";

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
        { label: "y", seconds: 31536000 },
        { label: "mo", seconds: 2592000 },
        { label: "w", seconds: 604800 },
        { label: "d", seconds: 86400 },
        { label: "h", seconds: 3600 },
        { label: "m", seconds: 60 },
    ];
    for (const i of intervals) {
        const count = Math.floor(seconds / i.seconds);
        if (count >= 1) return `${count}${i.label}`;
    }
    return "now";
};

const Tweets = () => {
    const { user } = useAuth();
    const [tweets, setTweets] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchTweets();
    }, [user]);

    const fetchTweets = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/tweets/user/${user._id}`);
            setTweets(res.data.data || []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            await API.post("/tweets", { content });
            setContent("");
            fetchTweets();
            toast.success("Tweet posted!");
        } catch {
            toast.error("Failed to post tweet");
        }
    };

    const handleLike = async (tweetId) => {
        try {
            const res = await API.post(`/likes/toggle/t/${tweetId}`);
            setTweets((prev) =>
                prev.map((t) =>
                    t._id === tweetId
                        ? {
                              ...t,
                              isLiked: res.data.data.isLiked,
                              likesCount: t.likesCount + (res.data.data.isLiked ? 1 : -1),
                          }
                        : t
                )
            );
        } catch {
            toast.error("Please sign in");
        }
    };

    const handleDelete = async (tweetId) => {
        try {
            await API.delete(`/tweets/${tweetId}`);
            setTweets((prev) => prev.filter((t) => t._id !== tweetId));
            toast.success("Tweet deleted");
        } catch {
            toast.error("Failed to delete tweet");
        }
    };

    return (
        <motion.div
            className="tweets-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h1>Tweets</h1>

            {user && (
                <form className="tweet-compose" onSubmit={handleCreate}>
                    <div className="tweet-compose-avatar">
                        <img src={user.avatar || "/default-avatar.png"} alt="" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <textarea
                            placeholder="What's happening?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={500}
                        />
                        <div className="tweet-compose-actions">
                            <motion.button
                                type="submit"
                                className="btn-primary"
                                whileTap={{ scale: 0.95 }}
                                style={{ padding: "8px 20px" }}
                            >
                                Post
                            </motion.button>
                        </div>
                    </div>
                </form>
            )}

            <div className="tweet-feed">
                {tweets.length > 0 ? (
                    tweets.map((tweet, i) => (
                        <motion.div
                            key={tweet._id}
                            className="tweet-card"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="tweet-avatar">
                                <img src={tweet.owner?.avatar || "/default-avatar.png"} alt="" />
                            </div>
                            <div className="tweet-body">
                                <div className="tweet-header">
                                    <h4>{tweet.owner?.fullName || tweet.owner?.username}</h4>
                                    <span>· {timeAgo(tweet.createdAt)}</span>
                                </div>
                                <p className="tweet-content">{tweet.content}</p>
                                <div className="tweet-actions">
                                    <motion.button
                                        className={`action-btn ${tweet.isLiked ? "active" : ""}`}
                                        onClick={() => handleLike(tweet._id)}
                                        whileTap={{ scale: 0.9 }}
                                        style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                                    >
                                        {tweet.isLiked ? <MdThumbUp /> : <MdThumbUpOffAlt />}
                                        {tweet.likesCount || 0}
                                    </motion.button>
                                    {user?._id === tweet.owner?._id && (
                                        <button
                                            className="action-btn"
                                            style={{ padding: "4px 12px", fontSize: "0.8rem", color: "var(--danger)" }}
                                            onClick={() => handleDelete(tweet._id)}
                                        >
                                            <MdDelete /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="empty-state">
                        <MdChat className="icon" />
                        <h3>No tweets yet</h3>
                        <p>Share your thoughts with the community!</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Tweets;
