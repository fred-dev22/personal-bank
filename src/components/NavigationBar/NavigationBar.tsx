import React, { useState, useEffect } from "react";
import { NavButton } from '@jbaluch/components';
//@ts-ignore
import '@jbaluch/components/styles';
import fynanc4 from '../../assets/fynanc-4.png';
import frameBg from '../../assets/frame-1000006035.png';
import "./NavigationBar.css";

interface NavItem {
  id: string;
  label: string;
  requiresPermission?: string | null;
}

interface Permissions {
  [key: string]: boolean | undefined;
  canViewFinancials?: boolean;
  canViewBorrowers?: boolean;
  canAccessApps?: boolean;
}

interface NavigationBarProps {
  mainNavItems?: NavItem[];
  bottomNavItems?: NavItem[];
  activeItemId?: string;
  isCollapsed?: boolean;
  permissions?: Permissions;
  onNavItemClick?: (data: any) => void;
  onSignOut?: (data: any) => void;
  onToggleCollapse?: (data: any) => void;
  onPermissionDenied?: (data: any) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  mainNavItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'vaults', label: 'Vaults' },
    { id: 'activity', label: 'Activity' }
  ],
  bottomNavItems = [
    { id: 'apps', label: 'Apps' },
    { id: 'help', label: 'Help' }
  ],
  activeItemId = 'overview',
  isCollapsed = false,
  permissions = {
    canViewFinancials: true,
    canViewBorrowers: true,
    canAccessApps: true
  },
  onNavItemClick = () => {},
  onSignOut = () => {},
  onToggleCollapse = () => {},
  onPermissionDenied = () => {}
}) => {
  const [activeItem, setActiveItem] = useState(activeItemId);
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [previousItem, setPreviousItem] = useState<string | null>(null);
console.log(previousItem);

  useEffect(() => {
    setActiveItem(activeItemId);
  }, [activeItemId]);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const hasPermission = (item: NavItem) => {
    if (!item.requiresPermission) return true;
    return permissions[item.requiresPermission] === true;
  };

  const handleItemClick = (item: NavItem) => {
    if (!hasPermission(item)) {
      const permissionData = {
        eventType: 'permissionDenied',
        itemId: item.id,
        timestamp: new Date().toISOString(),
        requiredPermission: item.requiresPermission,
        userPermissions: Object.keys(permissions).filter(key => permissions[key])
      };
      onPermissionDenied(permissionData);
      return;
    }
    setPreviousItem(activeItem);
    setActiveItem(item.id);
    const navData = {
      eventType: 'navigationChange',
      itemId: item.id,
      timestamp: new Date().toISOString(),
      previousItemId: activeItem,
      metadata: {
        itemLabel: item.label,
        requiresPermission: !!item.requiresPermission
      }
    };
    onNavItemClick(navData);
  };

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    const toggleData = {
      eventType: 'sidebarCollapse',
      isCollapsed: newState,
      timestamp: new Date().toISOString(),
      previousState: collapsed,
      viewport: {
        width: window.innerWidth,
        isMobile: window.innerWidth < 768
      }
    };
    onToggleCollapse(toggleData);
  };

  const handleSignOut = () => {
    const signOutData = {
      eventType: 'userSignOut',
      timestamp: new Date().toISOString(),
      sessionDuration: '1h 24m',
      userStatus: {
        pendingChanges: false,
        activeSessions: 1
      }
    };
    onSignOut(signOutData);
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = item.id === activeItem;
    const hasAuth = hasPermission(item);
    return (
      <NavButton
        key={item.id}
        label={item.label}
        selected={isActive}
        onClick={() => handleItemClick(item)}
        disabled={!hasAuth}
        className="navbutton-left"
      />
    );
  };

  return (
    <nav className={`navigation-bar${collapsed ? ' collapsed' : ''}`} aria-label="Main navigation">
      <aside className="desktop-nav">
        <header className="desktop-tabs">
          <div
            className={`logo-frame-container${collapsed ? ' collapsed' : ''}`}
            style={{
              backgroundImage: `url(${frameBg})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: collapsed ? '32px' : '48px',
              height: collapsed ? '32px' : '48px',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderRadius: '10px',
              paddingLeft: '8px'
            }}
          >
            <img
              className="fynanc"
              alt="Fynanc"
              src={fynanc4}
              loading="lazy"
              style={{
                width: collapsed ? '20px' : '32px',
                height: collapsed ? '20px' : '32px',
                objectFit: 'contain'
              }}
            />
          </div>
          {mainNavItems.map(renderNavItem)}
        </header>
        <footer className="desktop-bottom-tabs">
          {bottomNavItems.map(renderNavItem)}
          <NavButton
            label="Sign Out"
            selected={false}
            onClick={handleSignOut}
            className="navbutton-left"
          />
        </footer>
        <button 
          className="collapse-button"
          onClick={handleToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span>{collapsed ? '→' : '←'}</span>
        </button>
      </aside>
    </nav>
  );
};
