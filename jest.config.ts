export default {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.ts', // The global stub for weird files
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // The mock for style related files
    },
    transform: {
        // Use babel-jest to transform TypeScript/JavaScript files
        '^.+\\.(js|jsx|ts|tsx)$': [
            'babel-jest',
            {
                presets: [
                    '@babel/preset-env',
                    ['@babel/preset-react', { runtime: 'automatic' }],
                    '@babel/preset-typescript',
                ],
            },
        ],
    },
    transformIgnorePatterns: [
        // react-dnd and related packages use ES modules, so they should be transformed and not ignored
        '/node_modules/(?!react-dnd|dnd-core|@react-dnd|@babel/runtime)',
    ],
};
