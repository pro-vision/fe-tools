import { getAppConfig } from "../../../../helpers/paths";
import { moduleCompileTS } from "./compileTS/module";
import { legacyCompileTS } from "./compileTS/legacy";
import { moduleCompileES } from "./compileES/module";
import { legacyCompileES } from "./compileES/legacy";
import { moduleCompileJSX } from "./compileJSX/module";
import { legacyCompileJSX } from "./compileJSX/legacy";
import { moduleCompileTSX } from "./compileTSX/module";
import { legacyCompileTSX } from "./compileTSX/legacy";

export const getJSLoader = type => {
  const { useTS, useReact } = getAppConfig();
  let loaders = [moduleCompileTS, legacyCompileTS];

  if (!useTS) {
    loaders = [moduleCompileES, legacyCompileES];
  }
  else if (useReact) {
    loaders = [moduleCompileTSX, legacyCompileTSX];
  }

  if (useReact && !useTS) {
    loaders = [moduleCompileJSX, legacyCompileJSX];
  }

  if (type === "module") return loaders[0];

  return loaders[1];
};
