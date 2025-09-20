"use strict";

document.addEventListener("DOMContentLoaded", () => {
  let activeColorScheme = localStorage.getItem("color-scheme");
  if (activeColorScheme === null) {
    activeColorScheme = "system";
  }

  document.documentElement.dataset.colorScheme = activeColorScheme;

  const aside = document.createElement("aside");
  [
    { text: "浅色主题", colorScheme: "light", icon: "☀️" },
    { text: "深色主题", colorScheme: "dark", icon: "🌙" },
    { text: "跟随系统", colorScheme: "system", icon: "⭐" },
  ].forEach(({ text, colorScheme, icon }) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.name = "color-scheme";
    input.value = colorScheme;
    input.type = "radio";
    input.checked = activeColorScheme === colorScheme;
    input.addEventListener("click", () => {
      localStorage.setItem("color-scheme", colorScheme);
      document.documentElement.dataset.colorScheme = colorScheme;
    });

    label.append(input, icon, " ", text);
    aside.append(label);
  });

  document.body.append(aside);
});
