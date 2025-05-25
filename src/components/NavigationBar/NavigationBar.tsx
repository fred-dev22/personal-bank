import React, { useState, useEffect } from "react";
import { NavButton } from '@jbaluch/components';
//@ts-expect-error - External CSS import from @jbaluch/components/styles
import '@jbaluch/components/styles';
import "./NavigationBar.css";

interface NavItem {
  id: string;
  label: string;
}

interface NavigationBarProps {
  mainNavItems?: NavItem[];
  bottomNavItems?: NavItem[];
  activeItemId?: string;
  isCollapsed?: boolean;
  onNavItemClick?: (data: { itemId: string }) => void;
  onSignOut?: () => void;
  onToggleCollapse?: (data: { isCollapsed: boolean }) => void;
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
  onNavItemClick = () => {},
  onSignOut = () => {},
  onToggleCollapse = () => {}
}) => {
  const [activeItem, setActiveItem] = useState(activeItemId);
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    setActiveItem(activeItemId);
  }, [activeItemId]);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const handleItemClick = (item: NavItem) => {
    setActiveItem(item.id);
    onNavItemClick({ itemId: item.id });
  };

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onToggleCollapse({ isCollapsed: newState });
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = item.id === activeItem;
    return (
      <NavButton
        key={item.id}
        label={item.label}
        selected={isActive}
        onClick={() => handleItemClick(item)}
        className="navbutton-left"
      />
    );
  };

  return (
    <nav className={`navigation-bar${collapsed ? ' collapsed' : ''}`} aria-label="Main navigation">
      <aside className="desktop-nav">
        <header className="desktop-tabs">
          <img
            className="logo"
            alt="Logo"
            src="/favicon-32x32.png"
            loading="lazy"
          />
          {mainNavItems.map(renderNavItem)}
        </header>
        <footer className="desktop-bottom-tabs">
          {bottomNavItems.map(renderNavItem)}
          <NavButton
            label="Sign Out"
            selected={false}
            onClick={onSignOut}
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
