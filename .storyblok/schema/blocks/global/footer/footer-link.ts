import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { footerFolder } from '../../../folders';

export const footerLinkBlock = defineBlock({
  name: 'footer_link',
  is_root: false,
  is_nestable: true,
  folder: footerFolder,
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
