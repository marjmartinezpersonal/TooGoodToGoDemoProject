# Manage a Multi-Level Header and Footer in Storyblok with Next.js

This tutorial builds a site-wide header and footer that editors manage entirely in Storyblok, including a three-level primary navigation, a grouped footer, a newsletter call to action, and social media links. The content model lives in TypeScript and syncs to Storyblok through the Storyblok CLI, and a Next.js App Router frontend renders it with live preview in the Visual Editor.

![The Too Good To Go homepage with the About menu open in the dark teal header, next to a Business menu. The About panel has two columns: The app, with the links “How to collect a Too Good to Go surprise bag?” and “How does the app work?,” and About us, with the links “About Too Good to Go” and “Our history.” An “Explore About” link closes the panel. Below the header, the hero reads “Save good food from going to waste” above a Download the app button. The footer lists About Us links for Careers, Press, and Support, and Legal links for Terms and Conditions, Privacy Policy, and Cookie Policy. Next to them, a Keep in touch section reads “Sign up to our Newsletter” above a Sign up button, followed by Instagram, Facebook, TikTok, and X icons.](images/finished-site.png)

## The problem this model solves

The model comes from a real migration. A high-traffic consumer platform was leaving a legacy CMS in which editors couldn’t change the navigation without an engineering ticket. Analytics showed that visitors almost never reached anything below the third level of the menu, so the team cut the dead branches and capped the primary navigation at three levels. The new model needed to give editors full control of the header and footer while making that three-level decision impossible to undo by accident.

In the finished project, every link, label, and column is content. Editors change the navigation themselves, and the schema keeps the menu at three levels.

## Where to start

The tutorial has one track per audience, so each reader only follows the pages that concern them.

### Content editors

[Edit the header and footer in Storyblok](editors/edit-the-header-and-footer.md) covers every change an editor makes in Storyblok—menu items, footer links, the newsletter, and social links—without any code.

### Developers

Read the developer pages in this order:

1. [Set up the project](developers/setup.md)
2. [Design the content model](developers/content-model.md)
3. [Manage the schema as code](developers/schema-as-code.md)
4. [Render the header and footer with Next.js](developers/frontend.md)
5. [Troubleshoot the project](developers/troubleshooting.md)
