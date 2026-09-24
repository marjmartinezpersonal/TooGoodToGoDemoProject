import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

import { globalFolder } from '../../folders';

export const globalSettingsBlock = defineBlock({
  name: 'global_settings',
  is_root: true,
  is_nestable: false,
  folder: globalFolder,
  fields: [
    defineField('site_title', {
      type: 'text',
    }),
    defineField('navigation_tab', {
      display_name: 'Navigation',
      keys: [
        'nav',
      ],
      type: 'tab',
    }),
    defineField('footer_tab', {
      display_name: 'Footer',
      keys: [
        'footer',
        'newsletter',
        'social_links',
      ],
      type: 'tab',
    }),
    defineField('nav', {
      allow: [
        'navigation',
      ],
      minimum: 1,
      type: 'bloks',
    }),
    defineField('footer', {
      allow: [
        'footer_column',
      ],
      minimum: 1,
      type: 'bloks',
    }),
    defineField('newsletter', {
      allow: [
        'newsletter',
      ],
      maximum: 1,
      type: 'bloks',
    }),
    defineField('social_links', {
      allow: [
        'social_link',
      ],
      type: 'bloks',
    }),
  ],
});
