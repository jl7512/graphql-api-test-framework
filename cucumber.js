module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['stepdefs/*.ts', 'support/**/*.ts'],
    paths: ['features/*.feature'],
    format: ['@cucumber/pretty-formatter'],
    tags: process.env.TAGS || '@complete',
  },
};
