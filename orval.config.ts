import { defineConfig } from 'orval';

export default defineConfig({
  core: {
    input: {
      target: 'http://localhost:3001/api/docs-json',
    },
    output: {
      target: './src/api/generated.ts',
      client: 'axios',
      prettier: true,
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'customInstance',
        },
        transformer: (operation) => {
          operation.operationName = operation.operationName.replace('Controller', '');
          return operation;
        },
      },
    },
  },
});
