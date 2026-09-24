# Troubleshoot the Project

These problems came up while building this project. Each section explains the cause and the fix.

## npm and npx commands fail in a pnpm project

This project uses pnpm. Installing a package with npm in the same folder fails before anything installs:

```text
$ npm install @storyblok/react
npm ERR! Cannot read properties of null (reading 'matches')
```

pnpm stores packages in its own layout, using shortcuts (symbolic links) to a shared folder, and npm can’t read that layout. npm also ignores `pnpm-lock.yaml`, so even when npm works, it installs different versions than the project expects.

Using npx instead gives a different error. npx runs a package’s command, but it doesn’t install packages:

```text
$ npx install @storyblok/react
npm ERR! could not determine executable to run
```

npx looks for a package called `install`, and there isn’t one. Use these pnpm commands instead:

| Task | Command |
|---|---|
| Add a package | `pnpm add @storyblok/react` |
| Add a package only needed during development | `pnpm add --save-dev storyblok` |
| Run a command-line tool once without installing it | `pnpm dlx storyblok@latest schema init --space <space-id>` |
| Run an installed command-line tool | `pnpm exec storyblok` or a `package.json` script |

## The terminal uses the wrong Node.js version

The terminal doesn’t switch Node.js versions by itself when you open the project. The project needs Node.js 24, but the terminal was running 20.9.0. In the project folder, run `nvm use`, then `corepack enable` so the right pnpm version runs.

## The terminal can’t find the `schema` command

`schema` is part of the [Storyblok CLI](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-validate), not a separate program. Typing `schema validate` on its own fails with `schema: command not found`. Run it through the CLI instead, and include the path to the main schema file:

```bash
pnpm exec storyblok schema validate .storyblok/schema/schema.ts
```

The `pnpm schema:validate` script runs the same command.

## pnpm can’t find the `schema:push` script

pnpm shows `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL Command "schema:push" not found` when `package.json` has no script with that name. Add the two scripts from [Change the schema through code](schema-as-code.md#change-the-schema-through-code).

## Every request fails despite a token in `.env`

Next.js reads `.env.local` before `.env`, and it uses the first value it finds, even an empty one. An empty `STORYBLOK_DELIVERY_API_TOKEN=` line in `.env.local` hides the real token in `.env`, so every request fails. Keep each setting in one file only.

## The homepage returns a 404 error

The route loads a fixed story for `/`. The homepage story in Storyblok is called `homepage`, but the route first looked for `home`. The `HOME_SLUG` value in `lib/links.ts` now sets the name in one place.

## The development server refuses to start

Next.js 16 doesn’t allow two `next dev` servers for the same project. It shows `Another next dev server is already running`, with the running server’s port and process ID. Use the server that’s already running, or stop it first.

## The Visual Editor shows a blank preview

The Visual Editor is an HTTPS page, so it can’t show a site from `http://localhost:3000`. Run the site over HTTPS instead:

1. Start the server with `pnpm dev:https`. This runs `next dev --experimental-https`.
2. Open `https://localhost:3000` once and accept the browser’s certificate warning.
3. In Storyblok, set **Settings** → **Visual Editor** → **Location** to `https://localhost:3000/`.

Storyblok’s [Visual Preview in Next.js](https://www.storyblok.com/docs/guides/nextjs/visual-preview) guide has more detail.

## The LinkedIn icon doesn’t exist

The simple-icons package removed the LinkedIn logo at LinkedIn’s request, so `siLinkedin` doesn’t exist. The `platform` list leaves LinkedIn out, so every option has an icon.
