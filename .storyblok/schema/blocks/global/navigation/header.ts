import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { navigationFolder } from '../../../folders';

export const headerBlock = defineBlock({
  name: 'header',
  is_root: false,
  is_nestable: true,
  folder: navigationFolder,
  fields: [
    defineField('links', {
      allow: [
        'nav_top_item',
      ],
      type: 'bloks',
    }),
  ],
});
