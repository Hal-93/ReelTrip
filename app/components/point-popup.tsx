import React from "react";
import { Link } from "react-router";

const PointPopup: React.FC = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center
                 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700"
      style={{ margin: 0 }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          width: 360,
          padding: "32px 24px 20px 24px",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            marginBottom: 30,
            color: "#222",
            lineHeight: 1.6,
          }}
        >
          XXポイント消費して
          <br />
          もう一度動画を生成しますか？
        </div>

        <div
          style={{
            fontSize: 16,
            marginBottom: 36,
            textAlign: "left",
            paddingLeft: 8,
          }}
        >
          所持ポイント: XXX
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#444",
            textAlign: "left",
            marginBottom: 25,
            paddingLeft: 8,
          }}
        >
          ＊注意書きあれば
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* 戻る */}
          <button
            style={{
              fontSize: 18,
              padding: "12px 0",
              border: "none",
              borderRadius: 8,
              flex: 1,
              cursor: "pointer",
              background: "#444",
              color: "#fff",
            }}
            onClick={() => window.history.back()}
          >
            戻る
          </button>

          {/* 消費する */}
          <Link to="/reels-loading" style={{ flex: 1 }}>
            <button
              style={{
                fontSize: 18,
                padding: "12px 0",
                border: "none",
                borderRadius: 8,
                width: "100%",
                cursor: "pointer",
                background: "#2196f3",
                color: "#fff",
              }}
            >
              消費する
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PointPopup;
