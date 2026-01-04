# Jona van der Vlist portfolio monorepo

>[!NOTE] This Project is still a work in progress, So expect it to be some time before the site is live.

This repository contains all of the packages and sites to make my portfolio site work. This project is both my portfolio website and a portfolio project, which shows off all the skills I have accumulated over the past 5 years from my first day of college to now.

I have used all of these technologies in the past for some projects and I really hope I can show my progress as a developer by using them all together in this project. 

## Stack

This stack consists of a few parts, first, the frontend, which is the `ui` package. This package contains all the UI components used in the portfolio site. For this i have used the following technologies:

- [Svelte](https://svelte.dev/docs/svelte/overview)
- [Typescript](https://www.typescriptlang.org/)
- [Scss](https://sass-lang.com)
- [Storybook](https://storybook.js.org/)

The second part is the CMS, which is a [Kirby CMS](https://getkirby.com/) installation. This is a flat-file CMS as opposed to a database driven CMS like WordPress. Along side with Kirby i have used the following technologies:

- [PHP](https://www.php.net/)
- [KQL(Kirby Query Language)](https://github.com/getkirby/kql)
- [Vue.js (for kirby panel plugins)](https://vuejs.org/)

The third part is the tooling around the monorepo, for this i have used:
- [pnpm workspaces](https://pnpm.io/workspaces)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/#/)
- [Github Actions (Still WIP)](https://github.com/features/actions)

>[!NOTE] I will eventually replace both prettier and eslint with [oxfmt](https://oxc.rs) and [oxlint](https://oxc.rs) respectively, aside from that, i will also use [vite+](https://viteplus.dev/) in the future to make the monorepo easier to manage.

And lastly, the main site which ties everything together, this is also a SvelteKit application, which uses the `ui` package for all the components and fetches data from the CMS.

The technologies used for the main site are:
- [SvelteKit](https://svelte.dev/docs/kit/introduction)
- [Typescript](https://www.typescriptlang.org/)
- [Svelte](https://svelte.dev/docs/svelte/overview)
- [Vite (build tool)](https://vitejs.dev/)
