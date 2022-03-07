/*
 * https://jestjs.io/docs/configuration
 */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
  ],
  errorOnDeprecated: true,
  testEnvironment: "node",
  preset: 'ts-jest',
  slowTestThreshold: 10,
  testTimeout: 10000,
  testRegex: "/tests/.+/?.test.ts",
};