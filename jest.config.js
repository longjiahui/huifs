module.exports = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    // 将pkg-up进行transform
    // 意为除了pkg-up的node_modules模块都不进行transform
    transformIgnorePatterns: ['/node_modules/?!(pkg-up)/'],
}
