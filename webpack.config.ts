import { readJsonSync } from 'fs-extra';
import * as webpack from 'webpack';

type NodeEnv = "none" | "development" | "production" | undefined

module.exports = (config: webpack.Configuration, options: any, context: any): webpack.Configuration => {
    // Overwrite the mode set by Angular if the NODE_ENV is set
    if (nodeEnvValid(process.env['NODE_ENV'])) {
        config.mode = process.env['NODE_ENV'] || config.mode;
    }

    if (!config.plugins) {
        config.plugins = [];
    }

    const envPrefixes = ['NX'];
    if (config.resolve?.roots) {
        const project = readJsonSync(`${config.resolve.roots[0]}/project.json`);
        if (project.envPrefixes) {
            envPrefixes.push(...project.envPrefixes);
        }

    }
    config.plugins.push(new webpack.DefinePlugin(getClientEnvironment(envPrefixes)));
    return config;
};

function nodeEnvValid(nodeEnv: string | undefined): nodeEnv is NodeEnv {
    //TODO: Stub

    return true;
}


function getClientEnvironment(prefixes: string[]) {
    //TODO: This injects all the env vars with the given prefixes. THis isn't super secure - need to resolve that
    // One possible solution is inject env vars from a given list
    // Define a global.d.ts to remove need to include node type

    // Grab NX_* environment variables and prepare them to be injected
    // into the application via DefinePlugin in webpack configuration.
    const NX_APP = new RegExp(`^(${prefixes.join('|')})_`, 'i');

    const raw = Object.keys(process.env)
        .filter((key) => NX_APP.test(key))
        .reduce((env: NodeJS.ProcessEnv, key) => {
            env[key] = process.env[key];
            return env;
    }, {});

    // Stringify all values so we can feed into webpack DefinePlugin
    return {
            'process.env': Object.keys(raw).reduce((env: NodeJS.ProcessEnv, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {}),
    };
}
