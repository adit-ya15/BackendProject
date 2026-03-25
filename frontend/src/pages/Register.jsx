import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlay, FaCloudUploadAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Auth.css";

const Register = () => {
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
    });
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!avatar) {
            setError("Avatar is required");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("fullName", form.fullName);
            formData.append("username", form.username);
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("avatar", avatar);
            if (coverImage) formData.append("coverImage", coverImage);

            await register(formData);
            toast.success("Account created! Please sign in.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ maxWidth: 500 }}
            >
                <div className="auth-logo">
                    <h1>
                        <FaPlay style={{ color: "var(--accent-primary)", marginRight: 8 }} />
                        <span className="gradient-text">VideoTube</span>
                    </h1>
                    <p>Create your account</p>
                </div>

                {error && (
                    <motion.div
                        className="auth-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                    >
                        {error}
                    </motion.div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="John Doe"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="johndoe"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            className="input-field"
                            type="email"
                            placeholder="john@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Min 6 characters"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="file-upload-group">
                            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                                Avatar *
                            </label>
                            <label className={`file-upload-label ${avatar ? "has-file" : ""}`}>
                                <FaCloudUploadAlt />
                                {avatar ? avatar.name : "Choose avatar"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setAvatar(e.target.files[0])}
                                />
                            </label>
                        </div>
                        <div className="file-upload-group">
                            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                                Cover Image
                            </label>
                            <label className={`file-upload-label ${coverImage ? "has-file" : ""}`}>
                                <FaCloudUploadAlt />
                                {coverImage ? coverImage.name : "Choose cover"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCoverImage(e.target.files[0])}
                                />
                            </label>
                        </div>
                    </div>

                    <motion.button
                        className="btn-primary auth-submit"
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </motion.button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
