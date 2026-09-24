# Set Up the Project

This page gets the project running locally and connected to a Storyblok space. The setup builds on Storyblok’s [Next.js integration guide](https://www.storyblok.com/docs/guides/nextjs), which covers the basic SDK installation and first story fetch.

## Check the requirements

The project uses the following tools and accounts:

- A Storyblok space and its [**Preview** access token](https://www.storyblok.com/docs/concepts/access-tokens#content-delivery-api-access-tokens), from **Settings** → **Access Tokens**
- Node.js 24, pinned in the project’s `.nvmrc` file
- pnpm 9, pinned through the `packageManager` field in `package.json`
- Next.js 16 with the App Router, React 19, and Tailwind CSS 4
- The [`@storyblok/react` SDK](https://www.storyblok.com/docs/libraries/js/react-sdk), the [Storyblok CLI](https://www.storyblok.com/docs/libraries/storyblok-cli), and the [`@storyblok/schema` package](https://www.storyblok.com/docs/libraries/js/schema)

## Install the dependencies

Install the dependencies with pnpm. The project commits a `pnpm-lock.yaml` file, so npm and Yarn resolve a different dependency tree. [npm and npx commands fail in a pnpm project](troubleshooting.md#npm-and-npx-commands-fail-in-a-pnpm-project) explains the failure this causes. Run the following commands:

```bash
nvm use
corepack enable
pnpm install
pnpm add @storyblok/react
pnpm add --save-dev storyblok @storyblok/schema
```

## Add the access token

Create a `.env` file in the project root with the token and the space’s region:

```bash
STORYBLOK_DELIVERY_API_TOKEN=your-preview-token
STORYBLOK_REGION=eu
```

## Start the development server

The Visual Editor loads the site inside an HTTPS page, so the development server needs HTTPS too:

1. Start the development server with `pnpm dev:https`, which runs `next dev --experimental-https`.
2. Visit `https://localhost:3000` once to accept the self-signed certificate.
3. Set **Settings** → **Visual Editor** → **Location** to `https://localhost:3000/`.

Storyblok’s [Visual Preview in Next.js](https://www.storyblok.com/docs/guides/nextjs/visual-preview#set-the-default-environment) guide covers the same steps, including the **Real path** setting for the homepage story.

Next, [design the content model](content-model.md).
