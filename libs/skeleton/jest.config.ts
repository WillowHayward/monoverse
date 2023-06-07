/* eslint-disable */
export default {
    displayName: 'skeleton',

    globals: {},
    transform: {
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
            },
        ],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../coverage/libs/skeleton',
    preset: '../../jest.preset.js',
};
