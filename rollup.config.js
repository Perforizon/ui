import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import sass from "rollup-plugin-sass";
import svgr from "@svgr/rollup";
import copy from "rollup-plugin-copy";

import packageJson from "./package.json";
 
const globals = {
    lodash: 'lodash'
}
export default {
  input: "src/index.ts",

  output: [
    {
      dir: "./build",
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    svgr(),
    typescript({ useTsconfigDeclarationDir: true }),
    sass({
      insert: true
    })
  ]
};
