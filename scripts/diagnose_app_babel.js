"use strict";

const fs = require("fs");
const path = require("path");
const Babel = require("@babel/standalone");

const appPath = path.join(__dirname, "..", "src", "app.html");
const html = fs.readFileSync(appPath, "utf8");
const matches = [...html.matchAll(/<script type="text\/babel">([\s\S]*?)<\/script>/g)];
if (!matches.length) throw new Error("No se encontró script text/babel");

for (let index = 0; index < matches.length; index += 1) {
  try {
    Babel.transform(matches[index][1], { presets: ["react"], filename: `app-inline-${index + 1}.jsx` });
    console.log(`BABEL_OK bloque=${index + 1}`);
  } catch (error) {
    const htmlLine = html.slice(0, matches[index].index).split("\n").length;
    console.error(`BLOQUE=${index + 1} HTML_LINEA_BASE=${htmlLine}`);
    console.error(error.message);
    if (error.loc) console.error(JSON.stringify(error.loc));
    process.exitCode = 1;
  }
}
