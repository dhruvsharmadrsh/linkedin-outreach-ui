import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components';
import { Dashboard, Leads, Search, Messages, Analytics } from './pages';

const Settings: React.FC = () => (
    <div>
        <div className="header">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Settings</h1>
        </div>
        <div className="page-content">
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>Settings Coming Soon</h3>
                <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
                    Configure your workflow preferences, API keys, and notification settings.
                </p>
            </div>
        </div>
    </div>
);

function App() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <Router>
            <div className="app-layout">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
                <main
                    className="main-content"
                    style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}
                >
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/leads" element={<Leads />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
