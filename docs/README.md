# Manage a Multi-Level Header and Footer in Storyblok with Next.js

This project is a demo website for a technical exam, inspired by Too Good To Go. It isn’t affiliated with Too Good To Go. Its header and footer are managed in Storyblok, so editors can change them without asking a developer. The header has a menu with three levels. The footer has groups of links, a newsletter sign-up, and social media icons.

This tutorial explains how the project works: how the content is set up in Storyblok, how editors change it, and how the website shows it with Next.js.

![The Too Good To Go homepage with the About menu open in the dark teal header, next to a Business menu. The About panel has two columns: The app, with the links “How to collect a Too Good to Go surprise bag?” and “How does the app work?,” and About us, with the links “About Too Good to Go” and “Our history.” An “Explore About” link closes the panel. Below the header, the hero reads “Save good food from going to waste” above a Download the app button. The footer lists About Us links for Careers, Press, and Support, and Legal links for Terms and Conditions, Privacy Policy, and Cookie Policy. Next to them, a Keep in touch section reads “Sign up to our Newsletter” above a Sign up button, followed by Instagram, Facebook, TikTok, and X icons.](images/finished-site.png)

## The problem this project solves

The idea comes from a real website that was moving to a new content system. In its old system, editors couldn’t change the menu on their own. They had to ask a developer every time.

Before the move, the website’s menu went more than three levels deep: a menu item opened a list of links, and some of those links opened more lists of their own. The website’s visitor data showed that people almost never used the links below the third level. Those extra links still made the menu longer and harder to scan, and editors still had to keep them up to date. So the new menu stops at three levels: visitors get a shorter menu that’s faster to use, and editors have less to maintain.

The new setup had two goals:

- Editors can change every part of the header and footer themselves.
- The menu can’t grow past three levels by accident.

In this project, every link, label, and column in the header and footer is content that editors control, and Storyblok keeps the menu at three levels.

## Where to start

The tutorial has two parts. Read the part that matches your role.

### Content editors

[Edit the header and footer in Storyblok](editors/edit-the-header-and-footer.md) shows how to change menu items, footer links, the newsletter, and social media links in Storyblok. You don’t need to write any code.

### Developers

The developer pages assume you know React and Next.js. Read them in this order:

1. [Set up the project](developers/setup.md)
2. [Design the content model](developers/content-model.md)
3. [Manage the schema as code](developers/schema-as-code.md)
4. [Render the header and footer with Next.js](developers/frontend.md)
5. [Troubleshoot the project](developers/troubleshooting.md)
