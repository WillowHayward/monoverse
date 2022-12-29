import { LipwigOptions } from '@willhaycode/lipwig/types';

export const defaultConfig: LipwigOptions = {
     port: 8989,
     roomNumberLimit: 0,
     roomSizeLimit: 0,
     name: '',
     db: './lipwig.db',
};

export const testConfig = {
  ...defaultConfig,
  db: './lipwig.db.tmp'
};
