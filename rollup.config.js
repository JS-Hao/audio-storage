// import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "lib/audio-storage.es.js",
      format: "es",
      name: "AudioStorage"
    },
    {
      file: "lib/audio-storage.js",
      format: "umd",
      name: "AudioStorage"
    }
  ],
  plugins: [
    typescript(),
    babel({
      exclude: "node_modules/**" // 只编译我们的源代码
    })
  ]
};
