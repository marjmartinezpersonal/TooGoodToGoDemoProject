import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { footerFolder } from '../../../folders';

export const footerColumnBlock = defineBlock({
  name: 'footer_column',
  is_root: false,
  is_nestable: true,
  folder: footerFolder,
  fields: [
    defineField('items', {
      allow: [
        'footer_link',
      ],
      type: 'bloks',
    }),
    defineField('heading', {
      type: 'text',
    }),
  ],
});
