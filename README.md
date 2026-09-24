# Too Good To Go Header and Footer

> A demo project for a technical exam, not affiliated with Too Good To Go.

This project is a site inspired by Too Good To Go, with a header and footer that editors manage entirely in [Storyblok](https://www.storyblok.com). It includes a three-level primary navigation, a grouped footer, a newsletter call to action, and social media links. A Next.js App Router frontend renders the content, with live preview in the Storyblok Visual Editor.

The content model is defined as TypeScript code and syncs to Storyblok through the Storyblok CLI. The schema caps the navigation at three levels, so editors control every link and label but can’t rebuild menu depth that nobody uses.

## Tech stack

- Next.js 16 with the App Router, React 19, and Tailwind CSS 4
- [`@storyblok/react`](https://www.storyblok.com/docs/libraries/js/react-sdk) to fetch and render stories
- [`@storyblok/schema`](https://www.storyblok.com/docs/libraries/js/schema) and the [Storyblok CLI](https://www.storyblok.com/docs/libraries/storyblok-cli) to manage the content model as code
- Node.js 24 and pnpm 9

## Folder structure

```text
.
├── .storyblok/schema/   # The Storyblok content model as code
│   ├── schema.ts        # Registers every block and folder
│   ├── folders.ts       # Block Library folders (Global → Navigation, Footer)
│   └── blocks/          # One file per block: page, hero, and global/*
├── app/
│   ├── [[...slug]]/     # Catch-all route that renders any Storyblok story
│   ├── docs/            # Renders the tutorial in docs/ at /docs
│   └── layout.tsx       # Root layout
├── components/
│   ├── navigation/      # Header and the three-level navigation
│   ├── footer/          # Footer columns, newsletter, and social links
│   ├── storyblok/       # Components mapped to Storyblok blocks
│   └── StoryblokLink.tsx
├── lib/
│   ├── storyblok.ts     # SDK setup, block-to-component map, story fetching
│   └── links.ts         # Resolves multilink fields to story paths and URLs
├── docs/                # Tutorial for editors and developers
└── public/              # Static assets such as the logo and hero image
```

## How Storyblok fits in

Storyblok structures content as blocks. A content type is a block that stands alone as a story, and a nestable block only exists inside another block.

- **Pages.** Each page is a story of the `page` content type. The catch-all route in `app/[[...slug]]/page.tsx` fetches the story that matches the URL and renders it with `StoryblokStory`.
- **Global settings.** The header and footer live in one story, `global`, of the `global_settings` content type. Every page reads this story, so a change to the navigation applies site-wide.
- **Navigation.** One block per level keeps the menu at a fixed depth: `navigation` → `navigation-button` → `navigation-panel-column` → `navigation-panel-item`. The last level has no Blocks field, so a fourth level isn’t possible.
- **Footer.** The footer is flat: `footer_column` blocks group `footer_link` blocks, and the `newsletter` and `social_link` blocks sit in their own fields.
- **Links.** Every link field is a multilink field limited to internal stories and external URLs. `lib/links.ts` turns each one into a path or URL for the frontend.
- **Content fetching.** `lib/storyblok.ts` fetches draft content in development and published content in production. It also maps each Storyblok block to its React component.

## Get started

1. Install the dependencies:

   ```bash
   nvm use
   corepack enable
   pnpm install
   ```

2. Create a `.env` file in the project root with your space’s **Preview** access token and region:

   ```bash
   STORYBLOK_DELIVERY_API_TOKEN=your-preview-token
   STORYBLOK_REGION=eu
   ```

3. Start the development server with HTTPS, which the Visual Editor requires:

   ```bash
   pnpm dev:https
   ```

4. Visit `https://localhost:3000` and accept the self-signed certificate.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Starts the development server |
| `pnpm dev:https` | Starts the development server with HTTPS for the Visual Editor |
| `pnpm build` | Builds the site for production |
| `pnpm start` | Serves the production build |
| `pnpm lint` | Runs ESLint |
| `pnpm schema:validate` | Validates the content model in `.storyblok/schema/schema.ts` |
| `pnpm schema:push` | Pushes the content model to the Storyblok space |

## Documentation

The `docs/` folder holds a full tutorial with one track for content editors and one for developers. Start with the [tutorial overview](docs/README.md), or run the development server and open `/docs`.

## Author

Created by Marjorie Martinez.
