import inferLoaderFromFiletype from "./inferLoaderFromFiletype";
import { defaultConfig } from "../../config/default.config";

const customConfigts = {
  jsEntry: "src/index.ts"
};
const customConfigJs = {
  jsEntry: "src/index.js"
};
const customConfigTsx = {
  jsEntry: "src/index.tsx"
};
const customConfigJsx = {
  jsEntry: "src/index.jsx"
};

describe("infer loaders", () => {
  test("should infer correct loader for ts", () => {
    const inferedConfig = {
      ...defaultConfig,
      ...inferLoaderFromFiletype(customConfigts)
    };
    expect(inferedConfig.useTS).toBe(true);
    expect(inferedConfig.useReact).toBe(false);
  });
  test("should infer correct loader for js", () => {
    const inferedConfig = {
      ...defaultConfig,
      ...inferLoaderFromFiletype(customConfigJs)
    };
    expect(inferedConfig.useTS).toBe(false);
    expect(inferedConfig.useReact).toBe(false);
  });
  test("should infer correct loader for tsx", () => {
    const inferedConfig = {
      ...defaultConfig,
      ...inferLoaderFromFiletype(customConfigTsx)
    };
    expect(inferedConfig.useTS).toBe(true);
    expect(inferedConfig.useReact).toBe(true);
  });
  test("should infer correct loader for jsx", () => {
    const inferedConfig = {
      ...defaultConfig,
      ...inferLoaderFromFiletype(customConfigJsx)
    };
    expect(inferedConfig.useTS).toBe(false);
    expect(inferedConfig.useReact).toBe(true);
  });
});
