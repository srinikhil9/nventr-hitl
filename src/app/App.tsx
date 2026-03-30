import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { useWebSocketInit } from '@/hooks/useWebSocket';
import { useStore } from './store';
import { TopBar } from '@/components/layout/TopBar';
import { StatusBar } from '@/components/layout/StatusBar';
import { FleetPanel } from '@/features/fleet/FleetPanel';
import { CameraToolbar } from '@/features/cameras/CameraToolbar';
import { CameraGrid } from '@/features/cameras/CameraGrid';
import { ControlStrip } from '@/features/controls/ControlStrip';
import { RightPanel } from '@/components/layout/RightPanel';
import { SidebarNav, type WorkspaceView } from '@/components/layout/SidebarNav';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { EStopModal } from '@/features/estop/EStopModal';

function AppInner() {
  useWebSocketInit();
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>('overview');
  const setActiveTab = useStore((s) => s.setActiveTab);

  useEffect(() => {
    if (workspaceView === 'telemetry') {
      setActiveTab('telemetry');
    } else if (workspaceView === 'risk') {
      setActiveTab('risk');
    } else if (workspaceView === 'fleet') {
      setActiveTab('audit');
    }
  }, [workspaceView, setActiveTab]);

  const showRightPanel = workspaceView !== 'fleet';
  const contentColumns = showRightPanel
    ? '240px minmax(0, 1fr) 320px'
    : '340px minmax(0, 1fr)';

  return (
    <>
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '240px',
            flexShrink: 0,
            borderRight: '1px solid var(--border)',
            background: 'var(--bg-panel)',
          }}
        >
          <SidebarNav activeView={workspaceView} onSelectView={setWorkspaceView} />
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'var(--bg-muted)',
          }}
        >
          <TopBar />
          <StatusBar />
          <div
            style={{
              flex: 1,
              minHeight: 0,
              padding: '16px',
            }}
          >
            <div
              style={{
                height: '100%',
                display: 'grid',
                gridTemplateColumns: contentColumns,
                border: '1px solid var(--border)',
                borderRadius: '14px',
                background: 'var(--bg-base)',
                overflow: 'hidden',
              }}
            >
              <FleetPanel />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: 'var(--bg-base)',
                }}
              >
                <CameraToolbar />
                <CameraGrid />
                <ControlStrip />
              </div>
              {showRightPanel && <RightPanel />}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <EStopModal />
    </>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
