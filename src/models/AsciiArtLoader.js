import { types } from "mobx-state-tree";
import asciiArtFiles from "../../data/asciiArt/*.txt";

const AsciiArtLoader = types
  .model("AsciiArtLoader", {
    artData: types.map(types.string),
  })
  .views((self) => ({
    has(key) {
      return self.artData.has(key);
    },
    get(key) {
      return self.artData.get(key);
    },
  }))
  .actions((self) => ({
    loadFiles() {
      Object.entries(asciiArtFiles)
        .map(([key, asciiArtFile]) => {
          try {
            return [key, asciiArtFile];
          } catch (error) {
            console.error(`Failed to parse level data for: ${key}`, error);
          }
        })
        .forEach(([key, asciiArtData]) => {
          self.artData.set(key, asciiArtData);
        });
    },
  }));

export default AsciiArtLoader;
