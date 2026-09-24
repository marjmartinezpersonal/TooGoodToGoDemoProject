# Edit the Header and Footer in Storyblok

This guide is for content editors. It needs access to the Storyblok space and no code. The header and footer live in one story, **Global**, so every change you make there applies to every page on the site.

## Open the Global story

The Global story holds both the header and the footer:

1. In Storyblok, open **Content** and select the **Global** story.
2. The Visual Editor opens with the editing form next to a live preview of the header and footer. Select any part of the preview to open its fields in the form.

The form splits the fields into two tabs: **Navigation** for the header and **Footer** for the footer.

![The Global story in the Visual Editor. Selecting About in the header preview opens its Navigation Button block in the form, with the Label “About,” a Link, and a Panel that holds two Navigation Panel Column blocks, The app and About Us. Opening the About Us column shows its Heading and Items fields. Selecting Business in the preview then switches the form to the Business block, whose Panel holds one column, Business Solutions, with a Navigation Panel Item for Marketplace surprise bags.](../images/visual-editor-navigation-trimmed.gif)

## Change the header menu

The header menu has three levels:

- A **top-level item**, the **Navigation Button** block, sits in the header bar, such as **About** or **Business**.
- A **column**, the **Navigation Panel Column** block, groups related links in the item’s panel under a heading, such as **The app**.
- A **link**, the **Navigation Panel Item** block, opens a page, such as **Our history**.

### Add a top-level item

Each top-level item is a block in the navigation:

1. On the **Navigation** tab, open the **Navigation** block.
2. Add a block to **Buttons**. The block picker offers only **Navigation Button**.
3. Enter the **Label** that appears in the header.
4. Optional: set **Link** to the item’s landing page.

A top-level item without columns appears as a plain link in the header. Once it has a column, it opens a panel instead, and its **Link** becomes an “Explore” link at the bottom of the panel, such as **Explore About**.

### Add columns and links

Columns and links sit inside a top-level item:

1. In the top-level item, add a block to **Panel** and enter the column’s **Heading**.
2. In the column, add a block to **Items** for each link.
3. Enter each link’s **Label** and **Link**.

To reorder items, columns, or links, move their blocks in the form. The header shows them in the same order.

## Set a link

Every **Link** field accepts two link types:

- **Internal link:** select a story from the space. The link stays correct after someone renames or moves that story.
- **External link:** enter a web address, such as `https://example.com`. The site adds `https://` when the address leaves it out.

> **📸 Screenshot: the link field**
>
> - **Capture:** in Storyblok, open the **Global** story, open any navigation link, and open the **Link** field’s type list so it shows only the story and URL options. Use a full browser tab.
> - **Save as:** `docs/images/link-field-types.png`
> - **Then replace this box with:** `![Complete sentences that name the field and both visible link types](../images/link-field-types.png)`

## Edit the footer

The **Footer** tab holds three fields:

- **Footer** holds the link columns. Each **Footer Column** block has a **Heading**, such as **Legal**, and one **Footer Link** block per link in **Items**, each with a **Label** and a **Link**.
- **Newsletter** holds the newsletter section: a **Heading**, **Text**, a **Button label**, and a **Button link**. A new newsletter block arrives with the current copy prefilled, and the field accepts one block.
- **Social links** holds one block per icon. Choose the **Platform** and set **Link** to the profile page. The platform list offers Instagram, Facebook, TikTok, X, and YouTube.

## Publish your changes

The preview updates as you edit, but the live site shows only published content. Once the header and footer look right, select **Publish**. Every page picks up the change on its next load.

## What the header and footer accept

The model only offers the blocks and values that the site can display:

- Each field offers one block type, so every block lands at the right level.
- Links in a column are the last level. The menu stops at three levels, because visitors of the old site rarely went deeper.
- Menu links and footer links need both a **Label** and a **Link**, and social links need a **Platform** and a **Link**, so no entry appears empty or broken. A top-level item only needs a **Label**.
- Every platform in the social links list has a matching icon. LinkedIn isn’t in the list, because the icon set doesn’t include its logo.

Developers can read how the schema enforces these rules in [Guardrails for editors](../developers/content-model.md#guardrails-for-editors).
