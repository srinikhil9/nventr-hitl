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
import { ToastContainer } from '@/components/ui/ToastContainer';
import { EStopModal } from '@/features/estop/EStopModal';

function AppInner() {
  useWebSocketInit();

  return (
    <>
      <TopBar />
      <StatusBar />
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '220px 1fr 280px',
          gridTemplateRows: '1fr',
          overflow: 'hidden',
        }}
      >
        <FleetPanel />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'var(--bg-void)',
          }}
        >
          <CameraToolbar />
          <CameraGrid />
          <ControlStrip />
        </div>
        <RightPanel />
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
