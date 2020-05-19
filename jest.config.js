const path = require('path')

module.exports = {
    collectCoverage: false,
    collectCoverageFrom: ['./src/controllers/**/*.js', './src/models/**/*.js', './src/router.js'],
    coverageDirectory: './public/coverage',
    testTimeout: 100000,
    testEnvironment: 'node',
    modulePathIgnorePatterns: [
    ],
    coveragePathIgnorePatterns: [
      '/node_modules/'
    ],
    coverageReporters: ['lcov'],
  }
  