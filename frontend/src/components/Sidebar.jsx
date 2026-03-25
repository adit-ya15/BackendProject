import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    MdHome,
    MdVideoLibrary,
    MdHistory,
    MdThumbUp,
    MdPlaylistPlay,
    MdDashboard,
    MdChat,
} from "react-icons/md";
import { HiMenu } from "react-icons/hi";
import "./Sidebar.css";

const mainLinks = [
    { to: "/", icon: <MdHome />, label: "Home" },
    { to: "/liked-videos", icon: <MdThumbUp />, label: "Liked Videos" },
    { to: "/history", icon: <MdHistory />, label: "History" },
    { to: "/tweets", icon: <MdChat />, label: "Tweets" },
];

const studioLinks = [
    { to: "/dashboard", icon: <MdDashboard />, label: "Dashboard" },
    { to: "/my-content", icon: <MdVideoLibrary />, label: "My Content" },
    { to: "/playlists", icon: <MdPlaylistPlay />, label: "Playlists" },
];

const sidebarVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const linkVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
};

const Sidebar = ({ collapsed, onToggle, mobileOpen }) => {
    const location = useLocation();

    return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
            <motion.div
                className="sidebar-section"
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
            >
                {mainLinks.map((link) => (
                    <motion.div key={link.to} variants={linkVariants}>
                        <NavLink
                            to={link.to}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                        >
                            <span className="icon">{link.icon}</span>
                            <span className="label">{link.label}</span>
                        </NavLink>
                    </motion.div>
                ))}
            </motion.div>

            <hr className="sidebar-divider" />
            <p className="sidebar-section-title">Studio</p>

            <motion.div
                className="sidebar-section"
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
            >
                {studioLinks.map((link) => (
                    <motion.div key={link.to} variants={linkVariants}>
                        <NavLink
                            to={link.to}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                        >
                            <span className="icon">{link.icon}</span>
                            <span className="label">{link.label}</span>
                        </NavLink>
                    </motion.div>
                ))}
            </motion.div>

            <div className="sidebar-bottom">
                <div className="sidebar-brand">
                    <span>© 2026 VideoTube</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
