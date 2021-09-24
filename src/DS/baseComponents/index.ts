import { loadVueComponents } from '@/core/utils/loadVueComponents';

export const baseComponents = loadVueComponents(require.context('./', false, /\.vue$/), {
  getNameFromPath: path => `h-${path.replace(/[A-Z]/g, i => `-${i.toLowerCase()}`).replace(/(\.\/|\.vue)/g, '')}`
});

export const BaseComponentPackage = baseComponents;
