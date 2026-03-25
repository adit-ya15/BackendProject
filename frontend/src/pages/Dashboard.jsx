import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdVisibility, MdPeople, MdVideoLibrary, MdThumbUp, MdDelete, MdCloudUpload } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Dashboard.css";

const AnimatedCounter = ({ value }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const duration = 800;
        const start = 0;
        const startTime = Date.now();
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(start + (value - start) * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };
        tick();
    }, [value]);
    return <span>{display.toLocaleString()}</span>;
};

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalViews: 0, totalSubscribers: 0, totalVideos: 0, totalLikes: 0 });
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({ title: "", description: "" });
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const [statsRes, videosRes] = await Promise.all([
                API.get("/dashboard/stats"),
                API.get("/dashboard/videos"),
            ]);
            setStats(statsRes.data.data);
            setVideos(videosRes.data.data);
        } catch {
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (videoId) => {
        try {
            const res = await API.patch(`/videos/toggle/publish/${videoId}`);
            setVideos((prev) =>
                prev.map((v) =>
                    v._id === videoId ? { ...v, isPublished: res.data.data.isPublished } : v
                )
            );
            toast.success("Publish status updated");
        } catch {
            toast.error("Failed to toggle status");
        }
    };

    const handleDelete = async (videoId) => {
        if (!confirm("Delete this video permanently?")) return;
        try {
            await API.delete(`/videos/${videoId}`);
            setVideos((prev) => prev.filter((v) => v._id !== videoId));
            toast.success("Video deleted");
        } catch {
            toast.error("Failed to delete");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!videoFile || !thumbnail) {
            toast.error("Video file and thumbnail are required");
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", uploadForm.title);
            formData.append("description", uploadForm.description);
            formData.append("videoFile", videoFile);
            formData.append("thumbnail", thumbnail);
            await API.post("/videos", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Video uploaded!");
            setShowUpload(false);
            setUploadForm({ title: "", description: "" });
            setVideoFile(null);
            setThumbnail(null);
            fetchDashboard();
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const statCards = [
        { label: "Total Views", value: stats.totalViews, icon: <MdVisibility />, cls: "views" },
        { label: "Subscribers", value: stats.totalSubscribers, icon: <MdPeople />, cls: "subs" },
        { label: "Total Videos", value: stats.totalVideos, icon: <MdVideoLibrary />, cls: "videos" },
        { label: "Total Likes", value: stats.totalLikes, icon: <MdThumbUp />, cls: "likes" },
    ];

    return (
        <motion.div
            className="dashboard-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h1>Channel Dashboard</h1>

            <div className="stats-grid">
                {statCards.map((s, i) => (
                    <motion.div
                        key={s.label}
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                        <div className="stat-content">
                            <h3><AnimatedCounter value={s.value} /></h3>
                            <p>{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Upload Section */}
            <div className="upload-section">
                {!showUpload ? (
                    <>
                        <MdCloudUpload size={48} color="var(--text-tertiary)" />
                        <h3>Upload a Video</h3>
                        <p>Share your content with the world</p>
                        <button className="btn-primary" onClick={() => setShowUpload(true)}>
                            Select Files
                        </button>
                    </>
                ) : (
                    <form className="upload-form" onSubmit={handleUpload}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                className="input-field"
                                value={uploadForm.title}
                                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                placeholder="Video title"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="input-field"
                                value={uploadForm.description}
                                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                placeholder="Tell viewers about your video"
                                rows={3}
                                required
                            />
                        </div>
                        <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <label className={`file-upload-label ${videoFile ? "has-file" : ""}`}>
                                <FaCloudUploadAlt />
                                {videoFile ? videoFile.name : "Video file"}
                                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                            </label>
                            <label className={`file-upload-label ${thumbnail ? "has-file" : ""}`}>
                                <FaCloudUploadAlt />
                                {thumbnail ? thumbnail.name : "Thumbnail"}
                                <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
                            </label>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button type="submit" className="btn-primary" disabled={uploading}>
                                {uploading ? "Uploading..." : "Upload Video"}
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => setShowUpload(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Video Management Table */}
            <div className="content-table-section">
                <h2>Your Videos</h2>
                {videos.length > 0 ? (
                    <table className="content-table">
                        <thead>
                            <tr>
                                <th>Video</th>
                                <th>Status</th>
                                <th>Views</th>
                                <th>Likes</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video) => (
                                <motion.tr
                                    key={video._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <td>
                                        <div className="table-video-info">
                                            <div className="table-thumb">
                                                <img src={video.thumbnail} alt="" />
                                            </div>
                                            <span className="table-video-title">{video.title}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className={`toggle-switch ${video.isPublished ? "active" : ""}`}
                                            onClick={() => handleTogglePublish(video._id)}
                                        />
                                    </td>
                                    <td>{video.views?.toLocaleString()}</td>
                                    <td>{video.likesCount || 0}</td>
                                    <td style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                                        {new Date(video.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-danger" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => handleDelete(video._id)}>
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: "var(--text-secondary)" }}>No videos uploaded yet.</p>
                )}
            </div>
        </motion.div>
    );
};

export default Dashboard;
