/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { HomeDashboard } from './components/home/HomeDashboard';
import { LiveNowView } from './components/live/LiveNowView';
import { ExploreView } from './components/explore/ExploreView';
import { FollowingView } from './components/following/FollowingView';
import { VodLibraryView } from './components/vod/VodLibraryView';
import { MeetingsView } from './components/meetings/MeetingsView';
import { LiveStudioView } from './components/studio/LiveStudioView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { ModerationDashboard } from './components/admin/ModerationDashboard';
import { LiveViewerModal } from './components/live/LiveViewerModal';
import { VodPlayerModal } from './components/vod/VodPlayerModal';
import { MonetizationModal } from './components/monetization/MonetizationModal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    activeStream,
    setActiveStream,
    activeVideo,
    setActiveVideo,
  } = usePlatform();

  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard />;
      case 'live':
        return <LiveNowView />;
      case 'explore':
        return <ExploreView />;
      case 'following':
        return <FollowingView />;
      case 'vod':
        return <VodLibraryView />;
      case 'meetings':
        return <MeetingsView />;
      case 'studio':
        return <LiveStudioView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'moderation':
        return <ModerationDashboard />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract Navigation */}
      <Header onOpenCoinModal={() => setIsCoinModalOpen(true)} />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full pb-16 lg:pb-0">
        {/* Responsive Desktop Sidebar */}
        <Sidebar onOpenCoinModal={() => setIsCoinModalOpen(true)} />

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-x-hidden min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Live Stream Spectator Modal */}
      {activeStream && (
        <LiveViewerModal
          stream={activeStream}
          onClose={() => setActiveStream(null)}
          onOpenCoinModal={() => setIsCoinModalOpen(true)}
        />
      )}

      {/* VOD Player Modal */}
      {activeVideo && (
        <VodPlayerModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {/* Monetization & Virtual Coins Store Modal */}
      <MonetizationModal
        isOpen={isCoinModalOpen}
        onClose={() => setIsCoinModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
}
