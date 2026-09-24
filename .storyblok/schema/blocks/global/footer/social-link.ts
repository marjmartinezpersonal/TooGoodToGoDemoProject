import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { footerFolder } from '../../../folders';

export const socialLinkBlock = defineBlock({
  name: 'social_link',
  is_root: false,
  is_nestable: true,
  folder: footerFolder,
  fields: [
    defineField('platform', {
      options: [
        { name: 'Instagram', value: 'instagram' },
        { name: 'Facebook', value: 'facebook' },
        { name: 'TikTok', value: 'tiktok' },
        { name: 'X', value: 'x' },
        { name: 'YouTube', value: 'youtube' },
      ],
      required: true,
      type: 'option',
    }),
    defineField('link', {
      asset_link_type: false,
      email_link_type: false,
      required: true,
      type: 'multilink',
    }),
  ],
});
