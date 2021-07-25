require("dotenv").config();
const fs = require("fs");
const util = require("util");
const streamPipeline = util.promisify(require("stream").pipeline);
const fsp = fs.promises;
const fetch = require("node-fetch");
const csvToJson = require("csvtojson");

const sheetUrl = process.env.SHEET_URL;

function normalize(input) {
  return input.reduce((list, { hide, ...e }) => {
    if (hide || !e.UUID) {
      //remove things marked "hide"
      return list;
    }
    return [...list, e];
  }, []);
}

function groupByBrandModelSeries(input) {
  return input.reduce((table, e) => {
    const key = `${e.brand}-${e.series || "_"}-${e.model}`;
    const current = table[key] || [];
    1;
    return { ...table, [key]: [...current, e] };
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

function checkData(data) {
  return !Object.entries(data)
    .map(([key, value]) => {
      if (value.length > 1 && value.some((e) => e.version === "")) {
        console.warn(`Data could be wrong. See ${key}`, value.length);
        return false;
      }
      return true;
    })
    .includes(false);
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
  const isDataOK = checkData(jsonGrouped);
  if (isDataOK) {
    await renewData;
    await Promise.all([
      writeJSON("all", "data", jsonNormalize),
      writeJSON("grouped", "data", jsonGrouped),
      ...Object.entries(jsonGrouped).map(([key, value]) =>
        writeJSON(key, "data", value)
      ),
      ...jsonNormalize.flatMap(({ img, UUID }) => {
        if (!img) {
          return [];
        }
        const imgArray = img.split(" ");
        return imgArray.map((e, i) => imgToPublic(`${UUID}-${i}`, e));
      }),
    ]);
  }
}

main();
