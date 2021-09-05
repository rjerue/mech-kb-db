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
      [key]: keysToNumber.includes(key) ? parseFloat(value) : value,
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
  const data = renewFolder("data").then(() =>
    Promise.all([renewFolder("data/switches"), renewFolder("data/force-curve")])
  );
  return Promise.all([data, renewFolder("public/resources")]);
}

function writeJSON(name, path, data = { error: "No input!" }) {
  const fp = `${process.cwd()}/${path}/${name.replace(/ /g, "_")}.json`;
  return fsp
    .writeFile(fp, JSON.stringify(data))
    .then(() => console.log(`Wrote: ${fp}`));
}

async function writeFileStream(url, path) {
  const data = await fetch.default(url);
  if (!data.ok) {
    console.warn(`Unexpected response for ${url}. ${data.statusText}`);
  } else {
    return streamPipeline(data.body, fs.createWriteStream(path));
  }
}

function imgToPublic(imgUrl, id) {
  return writeFileStream(imgUrl, `${process.cwd()}/public/resources/${id}.jpg`);
}

function forceCurveToData(name, url) {
  if (url) {
    const u = `${url.match(/(.+\d+)/g)[0]}.json`;
    const fp = `${process.cwd()}/data/force-curve/${name}.json`;
    return writeFileStream(u, fp).then(() => {
      console.log(`Wrote: ${u} to ${fp}`);
    });
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
    writeJSON("all", "data/switches", jsonNormalize),
    writeJSON("grouped", "data/switches", jsonGrouped),
    ...Object.entries(jsonGrouped).flatMap(([key, value]) => {
      return [
        writeJSON(key, "data/switches", value),
        forceCurveToData(value.uuid, value.forceCurveUrl),
      ];
    }),
    ...jsonNormalize.flatMap(({ img, uuid }) => {
      if (!img) {
        return [];
      }
      const imgArray = img.split(" ");

      return imgArray.map((e, i) => imgToPublic(e, `${uuid}-${i}`));
    }),
  ]);
}

main();
