import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Changelog from "./Changelog";
import "../css/theme.css";
import ObrContextProvider from "../obr/ObrContextProvider";
import registerThemeListener from "../css/applyTheme";

document.addEventListener("DOMContentLoaded", async () => {
  const mainElement = document.createElement("main");
  document.body.append(mainElement);

  registerThemeListener();

  const root = createRoot(mainElement);
  root.render(
    <StrictMode>
      <ObrContextProvider>
        <Changelog />
      </ObrContextProvider>
    </StrictMode>,
  );
});
