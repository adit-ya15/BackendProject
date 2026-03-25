import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = () => {
        if (window.innerWidth <= 768) {
            setMobileOpen(!mobileOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    return (
        <div className="layout">
            <Header onToggleSidebar={toggleSidebar} />
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={toggleSidebar}
                mobileOpen={mobileOpen}
            />
            <main className={`layout-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
