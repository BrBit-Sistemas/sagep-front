import { defineConfig } from 'orval';

export default defineConfig({
  core: {
    input: {
      target: 'http://localhost:3001/api/docs-json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated.ts',
      client: 'axios',
      prettier: true,
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'customInstance',
        },
        transformer: (operation) => {
          if (operation.operationId.includes('_')) {
            const [, name] = operation.operationId.split('_');
            operation.operationName = name;
          }
          return operation;
        },
      },
    },
  },
});
