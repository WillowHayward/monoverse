import { existsSync } from 'fs';
import { readJsonSync } from 'fs-extra';
import * as webpack from 'webpack';

type NodeEnv = "none" | "development" | "production" | undefined

module.exports = (config: webpack.Configuration, options: any, context: any): webpack.Configuration => {
    // Overwrite the mode set by Angular if the NODE_ENV is set
    if (nodeEnvValid(process.env['NODE_ENV'])) {
        config.mode = process.env['NODE_ENV'] || config.mode;
    }


    ;
    if (!config.plugins) {
        config.plugins = [];
    }
    config.plugins.push(new webpack.DefinePlugin(injectEnvVars(config)));

    return config;
};

function nodeEnvValid(nodeEnv: string | undefined): nodeEnv is NodeEnv {
    //TODO: Stub

    return true;
}

function injectEnvVars(config: webpack.Configuration) {
    if (!config.resolve?.roots) {
        return {};
    }
        const path = `${config.resolve.roots[0]}/package.json`;
    if(!existsSync(path)) {
        return {};
    }


    const packageJson = readJsonSync(path);
    if (!packageJson.envVars) {
        return {};
    }


    const raw = Object.keys(process.env)
        .filter((key) => packageJson.envVars.includes(key))
        .reduce((env: NodeJS.ProcessEnv, key) => {
            env[key] = process.env[key];
            return env;
    }, {});

    // Stringify all values so we can feed into webpack DefinePlugin
    return {
            'window.env': Object.keys(raw).reduce((env: any, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {}),
    };

}
