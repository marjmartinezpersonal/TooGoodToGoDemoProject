# Design the Content Model

A **content model** is the structure of your content: which blocks exist, which fields they have, and what can go inside what. This page explains the content model behind the header and footer, and why it works this way.

Storyblok stores content in [blocks](https://www.storyblok.com/docs/concepts/blocks). A **block** is a reusable piece of content with its own fields. A [Blocks field](https://www.storyblok.com/docs/concepts/fields#blocks), of type `bloks`, holds a list of other blocks, which is how blocks go inside each other. A **content type** is a block that can be a story on its own, like a page. A **nestable block** only exists inside another block.

The whole header and footer is in one story, `global`, which uses the content type `global_settings`. Every page reads this same story, so editors change the menu in one place and the change shows everywhere.

## A navigation with three fixed levels

The menu uses a separate block for each level, instead of one block that can hold copies of itself:

| Level | Block | Fields | Can contain |
|---|---|---|---|
| Container | `navigation` | `buttons` | `navigation-button` |
| 1. Top-level item | `navigation-button` | `label`, `link`, `panel` | `navigation-panel-column` |
| 2. Column | `navigation-panel-column` | `heading`, `items` | `navigation-panel-item` |
| 3. Link | `navigation-panel-item` | `label`, `link` | nothing |

The common alternative is one `nav_item` block that can hold more `nav_item` blocks. That allows any number of levels, which helps when you don’t know how deep the menu will go. Here, the depth was already known: visitors didn’t use anything below the third level. So the model builds that limit in. The `navigation-panel-item` block has no `bloks` field, so an editor can’t add a fourth level.

Separate blocks also give each level its own fields. A column has a heading. A top-level item has an optional landing page. With one repeating block, every level would show every field, even the ones that don’t apply to it.

## A simple footer

The footer has a different job, so it has a different shape:

- `footer_column` groups links under a `heading`.
- `footer_link` holds a `label` and a `link`.
- `newsletter` holds a `heading`, a `text`, a `button_label`, and a `button_link`.
- `social_link` holds a `platform` and a `link`.

Visitors use the header menu to get somewhere, so it has levels. Visitors scan the footer for one specific thing, like the privacy policy, so it’s a single level of grouped links, like a site map. The newsletter and social links each have one fixed job, so they get their own fields in `global_settings` instead of sitting inside a column.

## Links limited to pages and web addresses

Every link uses Storyblok’s [Link field](https://www.storyblok.com/docs/concepts/fields#link), of type `multilink`. By default, a Link field can point to four things: a story, a web address (URL), a file from the asset library, or an email address. The header and footer only link to pages, so every Link field in this model turns off files and email:

```ts
defineField('link', {
  asset_link_type: false,
  email_link_type: false,
  required: true,
  type: 'multilink',
}),
```

Editors then see only the two options they need, as [Set a link](../editors/edit-the-header-and-footer.md#set-a-link) shows from their side. The website code also only handles two cases, as [Turn links into URLs](frontend.md#turn-links-into-urls) explains.

## Guardrails for editors

Each setting below removes one way an editor could break the header or footer by mistake. The [component schema field object](https://www.storyblok.com/docs/api/management/components/the-component-schema-field-object) reference lists every setting:

- **Each `bloks` field accepts one block type.** The `nav` field only accepts `navigation`, a `panel` only accepts `navigation-panel-column`, and so on. The block picker shows one choice at each level, so an editor can’t put a footer link in the header menu.
- **Single-use fields accept one block.** The `newsletter` field accepts one block, and the homepage `body` accepts one `hero`.
- **Fields are required where an empty value breaks the page.** A menu link without a `label` or `link` shows up empty or broken, so both are required. The top-level `link` is optional, because a top-level item can open a dropdown without its own page.
- **Repeated text has default values.** A new newsletter block starts with “Keep in touch,” “Sign up to our Newsletter,” and “Sign up.”
- **Social platforms come from a fixed list.** The `platform` field is an [Option field](https://www.storyblok.com/docs/concepts/fields#option-single-or-multi) with Instagram, Facebook, TikTok, X, and YouTube, so the website always has a matching icon.
- **Tabs and folders keep the form tidy.** The `global_settings` form splits its fields into **General**, **Navigation**, and **Footer** tabs. The Block Library groups the blocks into **Global** → **Navigation** and **Global** → **Footer** folders.

## More sites or languages

The same model works for several websites or languages. Create one global settings story for each site or language, and choose which one to load based on the request. The schema doesn’t need to change.

Next, [manage the schema as code](schema-as-code.md).
