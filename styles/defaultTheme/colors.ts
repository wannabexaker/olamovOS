const colors = {
  background: "#0a0010",
  fileEntry: {
    background: "hsla(286, 100%, 50%, 20%)",
    backgroundFocused: "hsla(286, 100%, 50%, 35%)",
    backgroundFocusedHover: "hsla(286, 100%, 60%, 40%)",
    border: "hsla(286, 100%, 70%, 55%)",
    borderFocused: "hsla(286, 100%, 70%, 80%)",
    borderFocusedHover: "hsla(286, 100%, 75%, 95%)",
    text: "#FFF",
    textShadow: `
      0 0 1px rgba(0, 0, 0, 75%),
      0 0 2px rgba(0, 0, 0, 50%),

      0 1px 1px rgba(0, 0, 0, 75%),
      0 1px 2px rgba(0, 0, 0, 50%),

      0 2px 1px rgba(0, 0, 0, 75%),
      0 2px 2px rgba(0, 0, 0, 50%)`,
  },
  highlight: "#cc00ff",
  progress: "hsla(286, 100%, 50%, 90%)",
  progressBackground: "hsla(270, 100%, 25%, 70%)",
  progressBarRgb: "rgb(204, 0, 255)",
  selectionHighlight: "hsla(286, 100%, 50%, 90%)",
  selectionHighlightBackground: "hsla(286, 100%, 50%, 30%)",
  taskbar: {
    active: "#1a0033",
    activeForeground: "#cc00ff",
    ai: {
      balanced: ["rgb(112, 203, 255)", "rgb(40, 112, 234)", "rgb(0, 95, 184)"],
      creative: [
        "rgb(215, 167, 187)",
        "rgb(145, 72, 135)",
        "rgb(139, 37, 126)",
      ],
      precise: ["rgb(167, 224, 235)", "rgb(0, 104, 128)", "rgb(0, 83, 102)"],
    },
    background: "#6600cc",
    button: {
      color: "#FFF",
    },
    foreground: "#1a0033",
    foregroundHover: "#330066",
    foregroundProgress: "hsla(286, 100%, 50%, 30%)",
    hover: "#1a0033",
    peekBorder: "hsla(286, 100%, 70%, 70%)",
  },
  text: "rgba(255, 255, 255, 90%)",
  titleBar: {
    background: "#6600cc",
    backgroundHover: "#1a0033",
    backgroundInactive: "#3d007a",
    buttonInactive: "rgb(128, 128, 128)",
    closeHover: "#cc00ff",
    text: "rgb(255, 255, 255)",
    textInactive: "rgb(170, 170, 170)",
  },
  window: {
    background: "#c0c0c0",
    outline: "#cc00ff",
    outlineInactive: "#6600cc",
    shadow: "2px 2px 0 #0a0010",
    shadowInactive: "2px 2px 0 rgba(10, 0, 16, 70%)",
  },
};

export default colors;
