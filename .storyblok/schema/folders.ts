import { defineFolder } from '@storyblok/schema';

export const globalFolder = defineFolder({
  name: 'Global',
});

export const footerFolder = defineFolder({
  name: 'Footer',
  parent: globalFolder,
});

export const navigationFolder = defineFolder({
  name: 'Navigation',
  parent: globalFolder,
});
