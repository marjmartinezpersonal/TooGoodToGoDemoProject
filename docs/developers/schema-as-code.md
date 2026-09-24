# Manage the Schema as Code

The **schema** is the list of blocks and their fields. Usually, you create and change it by hand in the Storyblok interface. That makes changes hard to review, hard to track, and hard to copy to another space. A **space** is one Storyblok project.

The [Storyblok CLI](https://www.storyblok.com/docs/libraries/storyblok-cli), Storyblok’s command-line tool, has a `schema` command that keeps the schema in TypeScript files in your code:

- [`schema init`](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-init) creates the TypeScript files from an existing space. You run it once.
- [`schema validate`](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-validate) checks the files for mistakes. It works offline.
- [`schema push --dry-run`](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-push) compares the files with the space and shows what would change, without changing anything.
- [`schema push`](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-push) applies the changes to the space.

## Start from an existing space

Run `schema init` once. Replace `<space-id>` with your space ID, from **Settings** → **Space**. It creates one file per block in `.storyblok/schema/blocks`, one file for block folders, and a main file, `schema.ts`, that lists everything:

```bash
pnpm dlx storyblok@latest schema init --space <space-id>
```

Right after `init`, a dry run reports every block as unchanged. That confirms the files match the space:

```text
Summary: 15 unchanged
ℹ Dry run — no changes applied.
```

## Change the schema through code

From then on, every change starts in a file. The [`@storyblok/schema` package](https://www.storyblok.com/docs/libraries/js/schema) gives you two helpers, [`defineBlock`](https://www.storyblok.com/docs/libraries/js/schema#defineblock) and [`defineField`](https://www.storyblok.com/docs/libraries/js/schema#definefield). Each field’s `type` decides which settings it accepts. This block definition adds the newsletter to the **Global** → **Footer** folder in the Block Library:

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

The project adds two scripts to `package.json`, so the path to the main file is written in one place:

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

Check the change, then review the dry run before you push:

```bash
pnpm schema:validate
pnpm schema:push --space <space-id> --dry-run
```

The dry run for adding the newsletter and social links shows two new blocks and one changed content type:

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

The output also shows how the TypeScript turns into Storyblok settings. For example, an `allow` list in code becomes [`component_whitelist` plus `restrict_components: true`](https://www.storyblok.com/docs/api/management/components/the-component-schema-field-object) in the space. When the changes look right, run the same command without `--dry-run`. The push never deletes a block that’s missing from your files unless you add `--delete`.

When a change removes a field, the push asks whether to create migration files, which are scripts that move old content to the new structure. If the field holds no content, add `--no-migrations` to skip the question.

## Get TypeScript types from the schema

The main schema file exports a [`Block` type](https://www.storyblok.com/docs/libraries/js/schema#typed-component-props). It creates a component’s props from its block definition, so you don’t write the types by hand:

```tsx
// components/footer/Newsletter.tsx
import type { Block } from "@/.storyblok/schema/schema";

export default function Newsletter({ blok }: { blok: Block<"newsletter"> }) {
  // ... blok.heading, blok.text, blok.button_label, and blok.button_link are typed
}
```

If someone renames or removes a field in the schema, TypeScript now shows an error in every component that uses it, before the change reaches the space.

Next, [render the header and footer with Next.js](frontend.md).
