// Standardized page header component for title, tabs, and action controls.
import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  icon,
  children,
  rightActions,
  className = 'header',
}) {
  return (
    <header className={className}>
      <div className="header-left">
        {icon && <div className="header-icon">{icon}</div>}
        {title && <h1 className="header-title">{title}</h1>}
        {subtitle && <p className="header-subtitle" style={{ fontSize: '13px', color: 'var(--text-3, #9ca3af)', margin: '4px 0 0' }}>{subtitle}</p>}
        {children}
      </div>
      {rightActions && <div className="header-right">{rightActions}</div>}
    </header>
  );
}
