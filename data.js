require("dotenv").config();
const fs = require("fs");
const util = require("util");
const streamPipeline = util.promisify(require("stream").pipeline);
const fsp = fs.promises;
const fetch = require("node-fetch");
const csvToJson = require("csvtojson");

const sheetUrl = process.env.SHEET_URL;
const keysToNumber = [
  "operatingForce",
  "activationPoint",
  "travelDistance",
  "lifespan",
];

function parseInput(input) {
  return Object.entries(input).reduce((obj, [key, value]) => {
    return {
      ...obj,
      [key]: keysToNumber.includes(key) ? parseInt(value) : value,
    };
  }, {});
}

function normalize(input) {
  return input.reduce((list, { hide, ...e }) => {
    if (hide || !e.uuid) {
      //remove things marked "hide"
      return list;
    }
    return [...list, parseInput(e)];
  }, []);
}

function groupByBrandModelSeries(input) {
  return input.reduce((table, e) => {
    const key = `${e.brand}-${e.switchName}`;
    return { ...table, [key]: e };
  }, {});
}

async function renewFolder(path) {
  const fp = `${process.cwd()}/${path}`;
  await fsp.rmdir(fp, { recursive: true });
  await fsp.mkdir(fp);
}

function renewDataFolder() {
  return Promise.all([renewFolder("data"), renewFolder("public/resources")]);
}

function writeJSON(name, path, data = { error: "No input!" }) {
  return fsp.writeFile(
    `${process.cwd()}/${path}/${name.replace(/ /g, "_")}.json`,
    JSON.stringify(data)
  );
}

async function imgToPublic(id, imgUrl) {
  const img = await fetch.default(imgUrl);
  if (!img.ok) {
    console.warn(`Unexpected response for ${imgUrl}. ${img.statusText}`);
  } else {
    return streamPipeline(
      img.body,
      fs.createWriteStream(`${process.cwd()}/public/resources/${id}.jpg`)
    );
  }
}

async function main() {
  const renewData = renewDataFolder();
  const csv = await fetch(sheetUrl);
  const json = await csvToJson().fromStream(csv.body);
  const jsonNormalize = normalize(json);
  const jsonGrouped = groupByBrandModelSeries(jsonNormalize);
  await renewData;
  await Promise.all([
    writeJSON("all", "data", jsonNormalize),
    writeJSON("grouped", "data", jsonGrouped),
    ...Object.entries(jsonGrouped).map(([key, value]) =>
      writeJSON(key, "data", value)
    ),
    ...jsonNormalize.flatMap(({ img, uuid }) => {
      if (!img) {
        return [];
      }
      const imgArray = img.split(" ");
      return imgArray.map((e, i) => imgToPublic(`${uuid}-${i}`, e));
    }),
  ]);
}

main();
