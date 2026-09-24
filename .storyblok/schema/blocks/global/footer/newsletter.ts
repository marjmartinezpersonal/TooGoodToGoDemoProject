import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { footerFolder } from '../../../folders';

export const newsletterBlock = defineBlock({
  name: 'newsletter',
  is_root: false,
  is_nestable: true,
  folder: footerFolder,
  fields: [
    defineField('heading', {
      default_value: 'Keep in touch',
      type: 'text',
    }),
    defineField('text', {
      default_value: 'Sign up to our Newsletter',
      type: 'text',
    }),
    defineField('button_label', {
      default_value: 'Sign up',
      type: 'text',
    }),
    defineField('button_link', {
      asset_link_type: false,
      email_link_type: false,
      required: true,
      type: 'multilink',
    }),
  ],
});
