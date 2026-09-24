# Manage the Schema as Code

Block definitions usually live only in the Storyblok UI, which makes them hard to review, version, or copy between spaces. The [Storyblok CLI](https://www.storyblok.com/docs/libraries/storyblok-cli)’s `schema` command group moves them into TypeScript files in the repository:

- [`schema init`](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-init) generates TypeScript files from an existing space, once.
- [`schema validate`](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-validate) checks those files offline, without an API call.
- [`schema push --dry-run`](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-push) compares the files against a space and prints the difference.
- [`schema push`](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-push) applies the difference.

## Bootstrap from an existing space

Run `schema init` once with the space ID from **Settings** → **Space**. The command writes one file per block into `.storyblok/schema/blocks`, one file for block folders, and an entry file, `schema.ts`, that registers everything:

```bash
pnpm dlx storyblok@latest schema init --space <space-id>
```

A dry run immediately after `init` reports every block as unchanged, which confirms that the local files match the space exactly:

```text
Summary: 15 unchanged
ℹ Dry run — no changes applied.
```

## Change the schema through code

Every later change starts in a file. The [`@storyblok/schema` package](https://www.storyblok.com/docs/libraries/js/schema) provides [`defineBlock`](https://www.storyblok.com/docs/libraries/js/schema#defineblock) and [`defineField`](https://www.storyblok.com/docs/libraries/js/schema#definefield), and each field’s `type` decides which settings it accepts. The following block definition adds the newsletter call to action to the **Global** → **Footer** folder of the Block Library:

```ts
// .storyblok/schema/blocks/global/footer/newsletter.ts
import { defineBlock, defineField } from '@storyblok/schema';
import { footerFolder } from '../../../folders';

export const newsletterBlock = defineBlock({
  name: 'newsletter',
  is_root: false,
  is_nestable: true,
  folder: footerFolder,
  fields: [
    defineField('heading', { default_value: 'Keep in touch', type: 'text' }),
    defineField('text', { default_value: 'Sign up to our Newsletter', type: 'text' }),
    defineField('button_label', { default_value: 'Sign up', type: 'text' }),
    defineField('button_link', {
      asset_link_type: false,
      email_link_type: false,
      required: true,
      type: 'multilink',
    }),
  ],
});
```

The project wraps the CLI in two `package.json` scripts, so the entry file path lives in one place:

```jsonc
// package.json
{
  "scripts": {
    // ...
    "schema:validate": "storyblok schema validate .storyblok/schema/schema.ts",
    "schema:push": "storyblok schema push .storyblok/schema/schema.ts"
  }
}
```

Validate the change, then review the dry run before pushing:

```bash
pnpm schema:validate
pnpm schema:push --space <space-id> --dry-run
```

The dry run for the newsletter and social links change shows two new blocks and one updated content type:

```text
  ~ global_settings (update)
    ~ schema.footer_tab.keys
      - ["footer"]
      + ["footer","newsletter","social_links"]
    + schema.newsletter: {"maximum":1,"type":"bloks","pos":5,"component_whitelist":["newsletter"],"restrict_components":true}
    + schema.social_links: {"type":"bloks","pos":6,"component_whitelist":["social_link"],"restrict_components":true}
  + newsletter (create)
  + social_link (create)

Summary: 2 to create, 1 to update, 15 unchanged
```

The diff also documents how the TypeScript maps to Storyblok’s own settings. An `allow` list in code becomes [`component_whitelist` plus `restrict_components: true`](https://www.storyblok.com/docs/api/management/components/the-component-schema-field-object) in the space. Run the same command without `--dry-run` to apply it. The push never deletes a block that the local files omit unless the command includes `--delete`.

## Derive component types from the schema

The generated entry file exports a [`Block` type](https://www.storyblok.com/docs/libraries/js/schema#typed-component-props) that derives a component’s props from its block definition. Each React component uses it instead of a hand-written interface:

```tsx
// components/footer/Newsletter.tsx
import type { Block } from "@/.storyblok/schema/schema";

export default function Newsletter({ blok }: { blok: Block<"newsletter"> }) {
  // ... blok.heading, blok.text, blok.button_label, and blok.button_link are typed
}
```

A renamed or removed field in the schema now fails the type check in every component that reads it, before the change reaches the space.

Next, [render the header and footer with Next.js](frontend.md).
