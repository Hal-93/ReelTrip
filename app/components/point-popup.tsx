import React from "react";

const PointPopup: React.FC = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0076b6 0%, #297fb8 100%)",
        height: "100vh",
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
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
          >
            戻る
          </button>
          <button
            style={{
              fontSize: 18,
              padding: "12px 0",
              border: "none",
              borderRadius: 8,
              flex: 1,
              cursor: "pointer",
              background: "#2196f3",
              color: "#fff",
            }}
          >
            消費する
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointPopup;