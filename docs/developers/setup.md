# Set Up the Project

This page gets the project running on your computer and connected to Storyblok. It builds on Storyblok’s [Next.js integration guide](https://www.storyblok.com/docs/guides/nextjs), which covers the basics.

## Check the requirements

You need these tools and accounts:

- A Storyblok space and its [**Preview** access token](https://www.storyblok.com/docs/concepts/access-tokens#content-delivery-api-access-tokens), from **Settings** → **Access Tokens**. The token lets the website read your content, including drafts.
- Node.js 24. The project’s `.nvmrc` file sets this version.
- pnpm 9, the package manager. The `packageManager` field in `package.json` sets this version.
- Next.js 16 with the App Router, React 19, and Tailwind CSS 4.
- The [`@storyblok/react` SDK](https://www.storyblok.com/docs/libraries/js/react-sdk), the [Storyblok CLI](https://www.storyblok.com/docs/libraries/storyblok-cli), and the [`@storyblok/schema` package](https://www.storyblok.com/docs/libraries/js/schema).

## Install the dependencies

Use pnpm to install the packages. The project includes a `pnpm-lock.yaml` file that records the exact version of every package. npm and Yarn don’t read this file, so they would install different versions. [npm and npx commands fail in a pnpm project](troubleshooting.md#npm-and-npx-commands-fail-in-a-pnpm-project) explains what goes wrong. Run these commands:

```bash
nvm use
corepack enable
pnpm install
pnpm add @storyblok/react
pnpm add --save-dev storyblok @storyblok/schema
```

## Add the access token

Create a `.env` file in the project’s main folder. Add the token and your space’s region, which is where Storyblok stores your space, such as `eu`:

```bash
STORYBLOK_DELIVERY_API_TOKEN=your-preview-token
STORYBLOK_REGION=eu
```

## Start the development server

The Visual Editor shows your site inside a secure (HTTPS) page, so your local site needs HTTPS too:

1. Start the server with `pnpm dev:https`. This runs `next dev --experimental-https`.
2. Open `https://localhost:3000` once and accept the browser’s certificate warning. Next.js creates the certificate on your computer, so the browser doesn’t know it yet.
3. In Storyblok, set **Settings** → **Visual Editor** → **Location** to `https://localhost:3000/`.
4. Open the homepage story, select **Config**, and set **Real path** to `/`. Without this, the Visual Editor opens `/homepage` instead of `/`.

Storyblok’s [Visual Preview in Next.js](https://www.storyblok.com/docs/guides/nextjs/visual-preview#set-the-default-environment) guide covers the same steps.

Next, [design the content model](content-model.md).
