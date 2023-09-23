import React from "react";
import { ThemeProvider, useTheme } from "styled-components";
import { RootContextProvider, rootStore, useRootStore } from "../models/Root";
import GlobalStyle from "../css/GlobalStyle";
import theme from "../css/theme";
import Battle from "./Battle";
import BattleIntro from "./BattleIntro";
import MainMenu from "./MainMenu";
import { observer } from "mobx-react-lite";
import Map from "./Map";
import mapTheme from "../css/mapTheme";

const App = observer(() => {
  const { scene } = useRootStore();
  const theme = useTheme();

  switch (scene) {
    case "mainMenu":
      return <MainMenu />;
    case "map":
      return (
        <ThemeProvider theme={{ ...theme, ...mapTheme }}>
          <Map />
        </ThemeProvider>
      );
    case "battleIntro":
      return <BattleIntro />;
    case "battle":
      return <Battle />;
    default:
      return <p>Not implemented scene!</p>;
  }
});

const withProviders = (WrappedComponent) => {
  return () => {
    return (
      <RootContextProvider value={rootStore}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <WrappedComponent />
        </ThemeProvider>
      </RootContextProvider>
    );
  };
};

export default withProviders(App);
