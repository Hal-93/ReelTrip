import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LocationHeaderProps {

  originText?: string; // スタート
  destinationText: string; // ゴール
}


const LocationHeader: React.FC<LocationHeaderProps> = ({ 
  originText = "現在地",
  destinationText 
}) => {
  // React Router v6以降のナビゲーションフック
  const navigate = useNavigate();

  const handleBack = () => {
    // 履歴を一つ戻る
    navigate(-1);
  };

  // --- スタイル定義（CSS in JS / インラインスタイル） ---
  const headerStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    color: 'white',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
  };

  const backButtonStyle: React.CSSProperties = {
    background: 'none', 
    border: 'none', 
    color: 'red', //見えずらいので赤に変更(今だけ)
    cursor: 'pointer',
    padding: 0,
    marginRight: '16px',
    fontSize: '24px', // 矢印のサイズ
    lineHeight: 1,
  };

  const inputContainerStyle: React.CSSProperties = {
    flexGrow: 1,
    backgroundColor: 'rgba(0, 79, 131, 0.78)', 
    borderRadius: '4px',
    padding: '4px 12px',
  };

  const locationItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 0',
  };

  const locationTextStyle: React.CSSProperties = {
    marginLeft: '12px',
    fontSize: '16px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.5',
  };

  const dividerStyle: React.CSSProperties = {
    borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
    margin: '4px 0',
  };

  // --- アイコン用コンポーネント ---
  // 始点の青い丸
  const OriginIcon = () => <div style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4a90e2'}}></div>;
  // 終点の赤いピン（Unicode文字のピンを使用）
  const DestinationIcon = () => <div style={{fontSize: '18px', color: '#d0021b', lineHeight: 1}}>&#9901;</div>;
  
  return (
    <div style={headerStyle}>
      {/* 戻るボタン */}
      <button 
        onClick={handleBack} 
        style={backButtonStyle}
        aria-label="戻る"
      >
        &#8592; {/* 左向きの矢印 */}
      </button>

      {/* 始点・終点の入力/表示エリア */}
      <div style={inputContainerStyle}>
        {/* 始点: 現在地 */}
        <div style={locationItemStyle}>
          <OriginIcon />
          <span style={locationTextStyle}>{originText}</span>
        </div>
        
        {/* 区切り線 */}
        <div style={dividerStyle}></div>

        {/* 終点: 玉川屋 */}
        <div style={locationItemStyle}>
          <DestinationIcon />
          <span style={locationTextStyle}>{destinationText}</span>
        </div>
      </div>
    </div>
  );
};

export default LocationHeader;