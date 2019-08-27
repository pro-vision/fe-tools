import { getAppConfig } from '../../../../helpers/paths';

import { moduleCompileTS } from './compileTS/module';
import { legacyCompileTS } from './compileTS/legacy';

import { moduleCompileES } from './compileES/module';
import { legacyCompileES } from './compileES/legacy';


export const getJSLoader = (type) => {
  const { useTS, useReact } = getAppConfig();
  let loaders = [
    moduleCompileTS,
    legacyCompileTS,
  ];

  if (!useTS) {
    loaders = [
      moduleCompileES,
      legacyCompileES
    ];
  }
  else if(useReact) {
    // return TSX.Loader here
  }

  if (useReact && !useReact) {
    // return JSX/JS loader here
  }

  if (type === 'module') return loaders[0];

  return loaders[1];
}