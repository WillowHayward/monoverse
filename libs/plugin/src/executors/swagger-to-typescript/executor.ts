import { SwaggerToTypescriptExecutorSchema } from './schema';
import { generateApi } from 'swagger-typescript-api';
import { resolve } from 'path';
import * as fs from 'fs';

export default async function runExecutor(
  options: SwaggerToTypescriptExecutorSchema,
) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; //TODO: REMOVE
    const baseUrl = process.env[options.envBaseUrl];
    const target = options.target;
    const url = `${baseUrl}/${target}`;
    const outputParts = options.outFile.split('/');
    const outputFile = outputParts.pop();
    const outputDir = resolve(process.cwd(), ['.'].concat(outputParts).join('/'));


    await generateApi({
        name: outputFile,
        output: outputDir,
        url
    });
  return {
    success: true
  };
}

