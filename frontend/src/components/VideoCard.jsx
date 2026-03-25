import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./VideoCard.css";

const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};

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

const formatViews = (views) => {
    if (!views) return "0 views";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
};

const VideoCard = ({ video, index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link to={`/video/${video._id}`} className="video-card">
                <div className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <span className="video-duration">
                        {formatDuration(video.duration)}
                    </span>
                </div>
                <div className="video-info">
                    <Link
                        to={`/channel/${video.owner?.username}`}
                        className="video-channel-avatar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={video.owner?.avatar || "/default-avatar.png"}
                            alt={video.owner?.username}
                        />
                    </Link>
                    <div className="video-details">
                        <h3 className="video-title">{video.title}</h3>
                        <Link
                            to={`/channel/${video.owner?.username}`}
                            className="video-channel-name"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {video.owner?.fullName || video.owner?.username}
                        </Link>
                        <div className="video-meta">
                            <span>{formatViews(video.views)}</span>
                            <span className="dot">●</span>
                            <span>{timeAgo(video.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export const VideoCardSkeleton = () => (
    <div className="video-card video-card-skeleton">
        <div className="video-thumbnail skeleton" />
        <div className="video-info">
            <div className="skeleton-avatar skeleton" />
            <div className="video-details">
                <div className="skeleton-title skeleton" />
                <div className="skeleton-channel skeleton" />
                <div className="skeleton-meta skeleton" />
            </div>
        </div>
    </div>
);

export default VideoCard;
