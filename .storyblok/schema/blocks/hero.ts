import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const heroBlock = defineBlock({
  name: 'hero',
  is_root: false,
  is_nestable: true,
  fields: [
    defineField('headline', {
      required: true,
      type: 'text',
    }),
    defineField('background_image', {
      filetypes: [
        'images',
      ],
      type: 'asset',
    }),
    defineField('button_label', {
      type: 'text',
    }),
    defineField('button_link', {
      asset_link_type: false,
      email_link_type: false,
      type: 'multilink',
    }),
  ],
});
