/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['./test/setup.ts'],
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/src/$1'
    }
};