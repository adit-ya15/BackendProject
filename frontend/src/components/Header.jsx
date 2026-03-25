import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdVideoCall, MdLogout, MdPerson, MdSettings } from "react-icons/md";
import { HiMenu } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = ({ onToggleSidebar }) => {
    const { user, logout } = useAuth();
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/?search=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-toggle" onClick={onToggleSidebar}>
                    <HiMenu />
                </button>
                <Link to="/" className="header-logo">
                    <FaPlay className="logo-icon" />
                    <span className="gradient-text">VideoTube</span>
                </Link>
            </div>

            <div className="header-center">
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">
                        <MdSearch />
                    </button>
                </form>
            </div>

            <div className="header-right">
                {user ? (
                    <>
                        <Link to="/dashboard" className="header-upload-btn">
                            <MdVideoCall size={20} />
                            <span>Upload</span>
                        </Link>

                        <div className="user-menu" ref={dropdownRef}>
                            <button
                                className="user-avatar-btn"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <img
                                    src={user.avatar || "/default-avatar.png"}
                                    alt={user.username}
                                />
                            </button>

                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        className="user-dropdown"
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <div className="user-dropdown-header">
                                            <img
                                                src={user.avatar || "/default-avatar.png"}
                                                alt={user.username}
                                            />
                                            <div className="user-dropdown-info">
                                                <h4>{user.fullName}</h4>
                                                <p>@{user.username}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/channel/${user.username}`}
                                            className="user-dropdown-link"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <MdPerson className="icon" />
                                            Your Channel
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className="user-dropdown-link"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <MdSettings className="icon" />
                                            Studio
                                        </Link>
                                        <button
                                            className="user-dropdown-link danger"
                                            onClick={handleLogout}
                                        >
                                            <MdLogout className="icon" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="btn-primary">
                        Sign In
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
