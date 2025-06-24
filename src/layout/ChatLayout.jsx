import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const ChatLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen relative">
      {/* Hamburger button for mobile, only when sidebar is closed */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow"
          onClick={() => setSidebarOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      {/* Sidebar for desktop & mobile */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default ChatLayout;