import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { navigationFolder } from '../../../folders';

export const navigationBlock = defineBlock({
  name: 'navigation',
  is_root: false,
  is_nestable: true,
  folder: navigationFolder,
  fields: [
    defineField('buttons', {
      allow: [
        'navigation-button',
      ],
      type: 'bloks',
    }),
  ],
});
