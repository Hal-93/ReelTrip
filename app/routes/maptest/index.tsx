import { DrawerDemo } from '~/components/map/mapfooter';
import { MapHeader } from '~/components/map/mapheader';

export default function MapTestPage() {
  return (
    <div>
      <MapHeader />

      {/* マップ本体やその他のコンテンツ */}
      <div style={{ padding: '20px' }}>
        <p>地図とルートが表示されるコンテンツ...</p>
      </div>

      <DrawerDemo/>
    </div>
  );
}