# Troubleshoot the Project

The following problems came up while building this project, with their causes and fixes.

## npm and npx commands fail in a pnpm project

The project pins pnpm in `package.json` and commits `pnpm-lock.yaml`. Installing a package with npm in the same folder fails before it adds anything:

```text
$ npm install @storyblok/react
npm ERR! Cannot read properties of null (reading 'matches')
```

pnpm builds `node_modules` from symbolic links into its own content-addressable store, and npm cannot read that layout when it tries to reconcile the existing tree. npm also ignores `pnpm-lock.yaml`, so even a successful npm install resolves different versions than the lockfile records.

Swapping npm for npx produces a different error, because npx runs a package’s executable rather than installing anything:

```text
$ npx install @storyblok/react
npm ERR! could not determine executable to run
```

npx treats `install` as the name of a package to run, and no package with that executable exists in the project. Use the pnpm equivalent for each task:

| Task | Command |
|---|---|
| Add a dependency | `pnpm add @storyblok/react` |
| Add a development dependency | `pnpm add --save-dev storyblok` |
| Run a CLI once without installing it | `pnpm dlx storyblok@latest schema init --space <space-id>` |
| Run an installed CLI | `pnpm exec storyblok` or a `package.json` script |

## The shell runs the wrong Node.js version

The shell’s active Node.js version doesn’t follow the project automatically. The project’s `.nvmrc` requests Node.js 24 while the shell ran 20.9.0. Run `nvm use` in the project folder, then `corepack enable` so the pinned pnpm version runs.

## The shell can’t find the `schema` command

The `schema` command is a subcommand of the [Storyblok CLI](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-validate), not a standalone program, so `schema validate` fails in the shell with `schema: command not found`. The `validate` and `push` subcommands also need the path to the entry file:

```bash
pnpm exec storyblok schema validate .storyblok/schema/schema.ts
```

The `pnpm schema:validate` script wraps the same command.

## pnpm can’t find the `schema:push` script

pnpm prints `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL Command "schema:push" not found` when `package.json` has no script with that name. Add the two scripts from [Change the schema through code](schema-as-code.md#change-the-schema-through-code).

## Every request fails despite a token in `.env`

Next.js reads `.env.local` before `.env`, and the first value it finds for a variable wins, even an empty one. An empty `STORYBLOK_DELIVERY_API_TOKEN=` line in `.env.local` hides the real token in `.env`, and every request fails. Keep each variable in one file.

## The homepage returns a 404 error

The catch-all route loads a fixed slug for `/`. The Storyblok space named the story `homepage`, while the route first expected `home`. The `HOME_SLUG` constant in `lib/links.ts` now holds the slug in one place.

## The development server refuses to start

Next.js 16 refuses to start a second `next dev` process for the same project and prints `Another next dev server is already running`, with the running server’s port and process ID. Use the running server, or stop it before starting a new one.

## The Visual Editor shows a blank preview

The Visual Editor loads the site inside an HTTPS page, so it cannot display `http://localhost:3000`. Serve the site over HTTPS instead:

1. Start the development server with `pnpm dev:https`, which runs `next dev --experimental-https`.
2. Visit `https://localhost:3000` once to accept the self-signed certificate.
3. Set **Settings** → **Visual Editor** → **Location** to `https://localhost:3000/`.

For more detail, refer to Storyblok’s [Visual Preview in Next.js](https://www.storyblok.com/docs/guides/nextjs/visual-preview) guide.

## The LinkedIn icon doesn’t exist

The simple-icons package removed the LinkedIn logo at LinkedIn’s request, so `siLinkedin` doesn’t exist. The `platform` option list leaves LinkedIn out, which keeps every option paired with an icon.
