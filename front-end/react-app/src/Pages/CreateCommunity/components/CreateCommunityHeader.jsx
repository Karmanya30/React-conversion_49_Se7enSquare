import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { getHomeRoute } from '../../../services/roleAccess';

/**
 * CreateCommunity page header: title, breadcrumb navigation, and progress bar.
 */
export default function CreateCommunityHeader({ activeTab, currentStep }) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  return (
    <>
      <div className="header">
        <div className="header-title">Create New</div>
        <div className="breadcrumb">
          <span
            className="bc-link"
            onClick={() => navigate(getHomeRoute(user?.role))}
            style={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            Home
          </span>
          <span className="bc-sep">›</span>
          <span className="bc-cur">
            {activeTab === 'community' ? 'Create Community' : 'Create Channel'}
          </span>
        </div>
      </div>

      {activeTab === 'community' && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      )}
    </>
  );
}
