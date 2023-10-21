import fs from 'fs';

const ENV_VARS = ['NODE_ENV'];

async function parseDotenv() {
  const envEntries = ENV_VARS.map((key) => [key, process.env[key]]);
  return Object.fromEntries(envEntries);
}

function writeEnv(parsedEnv) {
  const scriptFilePath = `${fs.realpathSync(process.cwd())}/services/motion/public/__ENV__.js`;
  fs.writeFileSync(scriptFilePath, `globalThis.__ENV__ = ${JSON.stringify(parsedEnv)}`);
}

const parsedEnv = await parseDotenv();
writeEnv(parsedEnv);
