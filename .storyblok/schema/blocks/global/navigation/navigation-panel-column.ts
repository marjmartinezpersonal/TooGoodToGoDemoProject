import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { navigationFolder } from '../../../folders';

export const navigationPanelColumnBlock = defineBlock({
  name: 'navigation-panel-column',
  is_root: false,
  is_nestable: true,
  folder: navigationFolder,
  fields: [
    defineField('heading', {
      type: 'text',
    }),
    defineField('items', {
      allow: [
        'navigation-panel-item',
      ],
      type: 'bloks',
    }),
  ],
});
