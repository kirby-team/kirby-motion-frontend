import fs from 'fs';

import Dotenv from 'dotenv';
import { findUp } from 'find-up';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

async function parseDotenv(appEnv) {
  const envFilePath = await findUp(`.env.${appEnv}`);
  return Dotenv.config({ path: envFilePath }).parsed || {};
}

function writeEnv(parsedEnv) {
  const scriptFilePath = `${fs.realpathSync(process.cwd())}/public/__ENV__.js`;
  fs.writeFileSync(scriptFilePath, `globalThis.__ENV__ = ${JSON.stringify(parsedEnv)}`);
}

async function copyEnv(appEnv) {
  const envFilePath = await findUp(`.env.${appEnv}`);
  const dotenvFilePath = `${fs.realpathSync(process.cwd())}/.env`;

  fs.copyFileSync(envFilePath, dotenvFilePath);
}

yargs(hideBin(process.argv))
  .command({
    command: 'next-env',
    describe: 'Create Next.js runtime environment file',
    builder: (args) => {
      return args.option('env', {
        type: 'string',
        description: 'Environment name',
      });
    },
    handler: async (args) => {
      const appEnv = args.env;
      const parsedEnv = await parseDotenv(appEnv);

      writeEnv(parsedEnv);
      await copyEnv(appEnv);

      return parsedEnv;
    },
  })
  .parse();
