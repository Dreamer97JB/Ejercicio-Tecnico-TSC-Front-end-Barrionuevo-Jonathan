import { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@angular|rxjs|tslib)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ],
  
  collectCoverage: true,
  coverageDirectory: 'coverage/jest',
  coverageReporters: ['html', 'text-summary']
};

export default config;
