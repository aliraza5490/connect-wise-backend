import { resolve } from 'path';

export const getAliases = (basePath = '../') => {
  return {
    '@models': resolve(__dirname, `${basePath}/models`),
    '@data': resolve(__dirname, `${basePath}/data`),
    '@routes': resolve(__dirname, `${basePath}/routes`),
    '@controllers': resolve(__dirname, `${basePath}/controllers`),
    '@middlewares': resolve(__dirname, `${basePath}/middlewares`),
    '@utils': resolve(__dirname, `${basePath}/utils`),
    '@root': resolve(__dirname, `${basePath}`),
  };
};
