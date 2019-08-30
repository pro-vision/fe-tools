import { devConfigModule } from "./dev/module";
import { devConfigLegacy } from "./dev/legacy";
import { prodConfigModule } from "./prod/module";
import { prodConfigLegacy } from "./prod/legacy";

export const getConfig = runMode => {

  if(runMode === "development") {
    return [
      devConfigModule,
      devConfigLegacy
    ];
  }

  return [
    prodConfigModule,
    prodConfigLegacy
  ];
};

export { getCustomWebpackConfig } from "../helpers/paths";