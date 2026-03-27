import { useStore } from '@/app/store';
import { CAMERA_REGISTRY, getCameraById } from '@/constants/cameras';
import type { LayoutMode, CameraDefinition } from '@/types/camera';

const LAYOUTS: LayoutMode[] = ['main', '2h', '4', '1'];

export function useCameras() {
  const activeFeeds = useStore((s) => s.activeFeeds);
  const selectedFeedId = useStore((s) => s.selectedFeedId);
  const layoutMode = useStore((s) => s.layoutMode);
  const addFeed = useStore((s) => s.addFeed);
  const removeFeed = useStore((s) => s.removeFeed);
  const selectFeed = useStore((s) => s.selectFeed);
  const setLayout = useStore((s) => s.setLayout);

  const activeFeedDefs: CameraDefinition[] = activeFeeds
    .map((id) => getCameraById(id))
    .filter((c): c is CameraDefinition => c !== undefined);

  const availableToAdd = CAMERA_REGISTRY.filter((c) => !activeFeeds.includes(c.id));

  const cycleLayout = () => {
    const idx = LAYOUTS.indexOf(layoutMode);
    setLayout(LAYOUTS[(idx + 1) % LAYOUTS.length]);
  };

  return {
    activeFeeds: activeFeedDefs,
    availableToAdd,
    selectedFeedId,
    addFeed,
    removeFeed,
    selectFeed,
    layoutMode,
    cycleLayout,
  };
}
