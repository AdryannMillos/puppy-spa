import { resolve } from 'path';

const seedFile = process.env.npm_config_file;

if (!seedFile) {
  console.error('No seed file specified. Use --file=<filename>.ts');
  process.exit(1);
}

const seedFilePath = resolve(__dirname, seedFile);

async function runSeedFile() {
  try {
    const seedModule = await import(seedFilePath);
    if (seedModule && typeof seedModule.default === 'function') {
      await seedModule.default();
      console.log('Seeding completed.');
    } else {
      console.error('Seed file does not export a default function');
    }
  } catch (error) {
    console.error('Error running seed file:', error);
    process.exit(1);
  }
}

runSeedFile();
