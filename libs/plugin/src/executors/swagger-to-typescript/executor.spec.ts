import { SwaggerToTypescriptExecutorSchema } from './schema';
import executor from './executor';

const options: SwaggerToTypescriptExecutorSchema = {};

describe('SwaggerToTypescript Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});