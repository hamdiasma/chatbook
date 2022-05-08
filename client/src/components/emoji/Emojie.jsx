import React from "react";

function Emojie({ setContent, content, theme }) {
  const reactions = [
    "😍",
    "❤️",
    "😘",
    "😗",
    "😚",
    "😳",
    "😆",
    "😯",
    "😢",
    "😡",
    "😄",
    "😂",
    "🤤",
    "😭",
    "😓",
    "😤",
    "👻",
    "💀",
    "🤐",
    "😴",
    "😷",
    "😵",
    "👍",
    "👎",
    "✌️",
    "🌹",
    "🌺",
  ];
  return (
    <div
      className="nav-item emoji  px-0 dropdown"
      style={{ filter: theme ? "invert(1)" : "invert(0)" }}
    >
      <span
        className="nav-link position-relative"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span>😆</span>
      </span>
      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
        <div className="reactions">
          {reactions.map((item, i) => (
            <span key={item} onClick={() => setContent(content + item)}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Emojie;
