import {MapHeader } from '~/components/map/mapheader';
import TaskBar from '~/components/taskbar/taskbar';

export default function MapTestPage() {
  return (
    <div>
      {/* LocationHeader を表示 */}
      <MapHeader/>
      <TaskBar/>

      {/* マップ本体やその他のコンテンツ */}
      <div style={{ padding: '20px' }}>
        <p>地図とルートが表示されるコンテンツ...</p>
      </div>
    </div>
  );
}