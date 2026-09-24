# Design the Content Model

Storyblok structures content as [blocks](https://www.storyblok.com/docs/concepts/blocks). A **block** is a reusable component with its own fields, and a [Blocks field](https://www.storyblok.com/docs/concepts/fields#blocks), of type `bloks`, holds a list of other blocks. A **content type** is a block that can stand alone as a story, and a **nestable block** only exists inside another block.

The whole header and footer live in one story, `global`, of the content type `global_settings`. Every page reads the same story, so editors change the navigation in one place and the change applies site-wide.

## A fixed-depth navigation

The primary navigation uses one purpose-built block per level instead of a single block that contains itself:

| Level | Block | Fields | Allowed children |
|---|---|---|---|
| Container | `navigation` | `buttons` | `navigation-button` |
| 1. Top-level item | `navigation-button` | `label`, `link`, `panel` | `navigation-panel-column` |
| 2. Column | `navigation-panel-column` | `heading`, `items` | `navigation-panel-item` |
| 3. Link | `navigation-panel-item` | `label`, `link` | none |

A self-referencing `nav_item` block that accepts more `nav_item` blocks supports any depth, which is the right choice when the depth is still unknown. Here the depth was a deliberate, data-backed decision, so the schema encodes it. The `navigation-panel-item` block has no `bloks` field at all, which means an editor cannot rebuild the fourth level that analytics already proved nobody used. The fixed structure also gives each level its own meaning: a column carries a heading, and a top-level item carries an optional landing page, which a generic recursive block cannot express without optional fields that only make sense at some depths.

## A flat footer

The footer solves a different problem, so it has a different shape:

- `footer_column` groups links under a `heading`.
- `footer_link` holds a `label` and a `link`.
- `newsletter` holds a `heading`, `text`, and a `button_label` and `button_link` pair.
- `social_link` holds a `platform` option and a `link`.

The primary navigation is shallow but branching, because visitors use it to complete a task. The footer is a single level of grouped links, closer to a sitemap, because visitors scan it for something specific such as legal pages or careers. The newsletter and social links are singletons with a fixed purpose, so they sit in their own `global_settings` fields instead of inside a generic column.

## Links restricted to stories and URLs

Every link field uses Storyblok’s [Link field](https://www.storyblok.com/docs/concepts/fields#link), of type `multilink`. A multilink field supports four link types by default: an internal story, an external URL, an asset, and an email address. The navigation and footer only ever point to pages, so every multilink field in this model disables the asset and email types:

```ts
defineField('link', {
  asset_link_type: false,
  email_link_type: false,
  required: true,
  type: 'multilink',
}),
```

Editors then get only the two link types this content needs, as [Set a link](../editors/edit-the-header-and-footer.md#set-a-link) shows from their side. The frontend also needs to handle only two cases, which [Resolve multilink fields](frontend.md#resolve-multilink-fields) covers.

## Guardrails for editors

Each of the following schema decisions removes a specific way for an editor to break the header or footer. The [component schema field object](https://www.storyblok.com/docs/api/management/components/the-component-schema-field-object) lists every setting behind them:

- **Allow lists on every `bloks` field.** The `nav` field only accepts `navigation`, a `panel` only accepts `navigation-panel-column`, and so on. The block picker offers exactly one option at each level, so an editor cannot place a footer link inside the main navigation.
- **Maximum counts on singletons.** The `newsletter` field accepts at most one block, and the homepage `body` accepts one `hero`.
- **Required fields where an empty value renders a broken element.** A navigation link without a `label` or `link` renders an empty or dead menu entry, so both fields are required. The top-level `link` stays optional, because a top-level item can open a panel without a landing page of its own.
- **Default values for repeated copy.** The newsletter block arrives prefilled with “Keep in touch,” “Sign up to our Newsletter,” and “Sign up.”
- **A fixed platform list for social links.** The `platform` field is an [Option field](https://www.storyblok.com/docs/concepts/fields#option-single-or-multi) with Instagram, Facebook, TikTok, X, and YouTube, so the frontend always has a matching icon.
- **Tabs and folders.** The `global_settings` content type splits its fields into **Navigation** and **Footer** tabs, and the Block Library groups the blocks into **Global** → **Navigation** and **Global** → **Footer** folders.

## Multiple sites and locales

The same model extends to multiple sites or locales by creating one global settings story per site or language and choosing the slug from the request, without any schema change.

Next, [manage the schema as code](schema-as-code.md).
