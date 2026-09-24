import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { navigationFolder } from '../../../folders';

export const navTopItemBlock = defineBlock({
  name: 'nav_top_item',
  is_root: false,
  is_nestable: true,
  folder: navigationFolder,
  fields: [
    defineField('items', {
      allow: [
        'nav_group',
      ],
      type: 'bloks',
    }),
    defineField('label', {
      required: true,
      type: 'text',
    }),
    defineField('link', {
      asset_link_type: false,
      email_link_type: false,
      type: 'multilink',
    }),
  ],
});
