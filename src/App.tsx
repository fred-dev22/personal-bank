import { useState, useEffect } from 'react'
import { NavigationBar } from './components/NavigationBar/NavigationBar'
import { Overview } from './components/Overview/Overview'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState({ loans: 3, activity: 5 });

  // User permissions
  const [userPermissions] = useState({
    canViewFinancials: true,
    canViewBorrowers: true,
    canAccessApps: true
  });

  // Navigation items (ordre et labels selon la capture)
  const mainNavItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'loans', label: 'Loans' },
    { id: 'vaults', label: 'Vaults' },
    { id: 'activity', label: 'Activity' },
    { id: 'financials', label: 'Financials', requiresPermission: 'canViewFinancials' },
    { id: 'borrowers', label: 'Borrowers', requiresPermission: 'canViewBorrowers' },
  ];

  const bottomNavItems = [
    { id: 'settings', label: 'Settings' },
    { id: 'apps', label: 'Apps', requiresPermission: 'canAccessApps' },
    { id: 'help', label: 'Help' },
  ];

  // Callback handlers
  const handleNavigation = (data: any) => {
    setCurrentPage(data.itemId);
    if (data.itemId in notificationCount) {
      setNotificationCount(prev => ({
        ...prev,
        [data.itemId]: null
      }));
    }
  };

  const handleSignOut = () => {};
  const handleToggleCollapse = (data: any) => {
    setSidebarCollapsed(data.isCollapsed);
    localStorage.setItem('sidebarCollapsed', String(data.isCollapsed));
  };
  const handlePermissionDenied = () => {};

  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState === null) {
      setSidebarCollapsed(false);
      localStorage.setItem('sidebarCollapsed', 'false');
    } else if (savedCollapsedState === 'true') {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <NavigationBar
        mainNavItems={mainNavItems}
        bottomNavItems={bottomNavItems}
        activeItemId={currentPage}
        isCollapsed={sidebarCollapsed}
        permissions={userPermissions}
        onNavItemClick={handleNavigation}
        onSignOut={handleSignOut}
        onToggleCollapse={handleToggleCollapse}
        onPermissionDenied={handlePermissionDenied}
      />
      <div style={{ flex: 1, background: '#f7f8fa', minHeight: '100vh', padding: '56px 0 0 56px' }}>
        {currentPage === 'overview' && <Overview />}
      </div>
      </div>
  );
}

export default App
