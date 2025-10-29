import LocationHeader from '../../components/map/map-header';
import {CardDemo} from '../../components/map/mapheader';

export default function MapTestPage() {
  return (
    <div>
      {/* LocationHeader を表示 */}
      <LocationHeader originText="現在地" destinationText="玉川屋" />
      <CardDemo />

      {/* マップ本体やその他のコンテンツ */}
      <div style={{ padding: '20px' }}>
        <p>地図とルートが表示されるコンテンツ...</p>
      </div>
    </div>
  );
}