import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { useWebSocketInit } from '@/hooks/useWebSocket';
import { TopBar } from '@/components/layout/TopBar';
import { StatusBar } from '@/components/layout/StatusBar';
import { FleetPanel } from '@/features/fleet/FleetPanel';
import { CameraToolbar } from '@/features/cameras/CameraToolbar';
import { CameraGrid } from '@/features/cameras/CameraGrid';
import { ControlStrip } from '@/features/controls/ControlStrip';
import { RightPanel } from '@/components/layout/RightPanel';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { EStopModal } from '@/features/estop/EStopModal';

function AppInner() {
  useWebSocketInit();

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
          <SidebarNav />
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
                gridTemplateColumns: '240px minmax(0, 1fr) 320px',
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
              <RightPanel />
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
