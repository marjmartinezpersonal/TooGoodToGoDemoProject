import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { navigationFolder } from '../../../folders';

export const navLinkBlock = defineBlock({
  name: 'nav_link',
  is_root: false,
  is_nestable: true,
  folder: navigationFolder,
  fields: [
    defineField('label', {
      required: true,
      type: 'text',
    }),
    defineField('link', {
      asset_link_type: false,
      email_link_type: false,
      required: true,
      type: 'multilink',
    }),
  ],
});
