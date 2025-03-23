export default {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js', // The global stub for weird files
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // The mock for style related files
    },
};
