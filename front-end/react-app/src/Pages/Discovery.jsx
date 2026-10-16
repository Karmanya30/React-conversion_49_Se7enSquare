import React from 'react';
import SideBar from '../Components/SideBar';
import useDiscovery from '../Components/platform/hooks/useDiscovery';
import DiscoveryHeader from './Discovery/components/DiscoveryHeader';
import CategoryFilterBar from './Discovery/components/CategoryFilterBar';
import CommunityGrid from './Discovery/components/CommunityGrid';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/discovery.css';

/**
 * Discovery Page — thin orchestrator.
 * All state, filtering, sorting and join/leave logic lives in useDiscovery().
 */
export default function Discovery() {
  const {
    communities, loading, loadWarning,
    search, setSearch,
    activeCategory, setActiveCategory,
    sortBy, setSortBy,
    showSort, setShowSort,
    joinedIds, toggleJoin,
    categories, filtered,
    totalMembers, totalOnline, eventCount,
    toastMsg,
  } = useDiscovery();

  return (
    <div className="app-shell">
      <SideBar />
      <div className="main">
        <DiscoveryHeader
          search={search}
          onSearchChange={setSearch}
          communities={communities}
          totalMembers={totalMembers}
          totalOnline={totalOnline}
          eventCount={eventCount}
          loadWarning={loadWarning}
        />

        <div className="content">
          <CategoryFilterBar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            sortBy={sortBy}
            onSortChange={(key) => { setSortBy(key); setShowSort(false); }}
            showSort={showSort}
            onToggleSort={() => setShowSort(s => !s)}
          />

          <CommunityGrid
            loading={loading}
            filtered={filtered}
            communities={communities}
            joinedIds={joinedIds}
            onToggleJoin={toggleJoin}
          />
        </div>
      </div>

      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#1c2333', color: '#fff', border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: '10px', padding: '10px 18px', fontSize: '13.5px', zIndex: 2000,
          boxShadow: '0 8px 30px rgba(0,0,0,0.45)', maxWidth: '80vw',
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}
