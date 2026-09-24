import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { navigationFolder } from '../../../folders';

export const navGroupBlock = defineBlock({
  name: 'nav_group',
  is_root: false,
  is_nestable: true,
  folder: navigationFolder,
  fields: [
    defineField('links', {
      allow: [
        'nav_link',
      ],
      type: 'bloks',
    }),
  ],
});
