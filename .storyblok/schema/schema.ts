import { defineSchema } from '@storyblok/schema';
import type { Schema as InferSchema, Story as InferStory } from '@storyblok/schema';
import type { BlockContent, MapiStory as InferStoryMapi } from '@storyblok/schema';

import { footerColumnBlock } from './blocks/global/footer/footer-column';
import { footerLinkBlock } from './blocks/global/footer/footer-link';
import { newsletterBlock } from './blocks/global/footer/newsletter';
import { socialLinkBlock } from './blocks/global/footer/social-link';
import { globalSettingsBlock } from './blocks/global/global-settings';
import { heroBlock } from './blocks/hero';
import { headerBlock } from './blocks/global/navigation/header';
import { navGroupBlock } from './blocks/global/navigation/nav-group';
import { navigationBlock } from './blocks/global/navigation/navigation';
import { navigationButtonBlock } from './blocks/global/navigation/navigation-button';
import { navigationPanelColumnBlock } from './blocks/global/navigation/navigation-panel-column';
import { navigationPanelItemBlock } from './blocks/global/navigation/navigation-panel-item';
import { navLinkBlock } from './blocks/global/navigation/nav-link';
import { navTopItemBlock } from './blocks/global/navigation/nav-top-item';
import { pageBlock } from './blocks/page';
import { globalFolder, footerFolder, navigationFolder } from './folders';

export const schema = defineSchema({
  blocks: {
    footerColumnBlock,
    footerLinkBlock,
    globalSettingsBlock,
    headerBlock,
    heroBlock,
    navGroupBlock,
    navigationBlock,
    navigationButtonBlock,
    navigationPanelColumnBlock,
    navigationPanelItemBlock,
    navLinkBlock,
    navTopItemBlock,
    newsletterBlock,
    pageBlock,
    socialLinkBlock,
  },
  folders: {
    globalFolder,
    footerFolder,
    navigationFolder,
  },
});

export type Schema = InferSchema<typeof schema>;
export type Blocks = Schema['blocks'];
export type FieldPlugins = Schema['fieldPlugins'];
export type Story = InferStory<Blocks, FieldPlugins>;
export type StoryMapi = InferStoryMapi<Blocks, FieldPlugins>;

// Type a component's props by block name: `Block<"hero">`.
export type Block<TName extends Blocks['name']> = BlockContent<
  Extract<Blocks, { name: TName }>,
  Blocks,
  FieldPlugins
>;

// Loose union of every block's content, for a dynamic component dispatcher.
export type AnyBlock = BlockContent<Blocks, Blocks, FieldPlugins>;
