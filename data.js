require("dotenv").config();
const fs = require("fs").promises;
const fetch = require("node-fetch");
const csvToJson = require("csvtojson");

const sheetUrl = process.env.SHEET_URL;

function normalize(input) {
  return input.reduce((list, { hide, ...e }) => {
    if (hide) {
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
    return { ...table, [key]: [...current, e] };
  }, {});
}

async function renewDataFolder() {
  await fs.rmdir("./data", { recursive: true });
  await fs.mkdir("./data");
}

async function writeData(name, data = { error: "No input!" }) {
  return fs.writeFile(
    `${process.cwd()}/data/${name.replace(/ /g, "_")}.json`,
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
      writeData("all", jsonNormalize),
      writeData("grouped", jsonGrouped),
      ...Object.entries(jsonGrouped).map(([key, value]) =>
        writeData(key, value)
      ),
    ]);
  }
}

main();
