# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg" width="40" /> Nuxt Learnings

This repo is a collection of my learnings and experiments with Nuxt.

- [ Nuxt Learnings](#-nuxt-learnings)
  - [File based routing](#file-based-routing)
  - [Layouts](#layouts)
  - [Assets \& Public Directories](#assets--public-directories)
  - [Middleware ( Authentication, etc. )](#middleware--authentication-etc-)
  - [Server-Side Rendering (SSR) and Static Site Generation (SSG)](#server-side-rendering-ssr-and-static-site-generation-ssg)
  - [Server Actions with API Routes (Serverless Functions)](#server-actions-with-api-routes-serverless-functions)
  - [Project Structure with Nuxt.config.ts](#project-structure-with-nuxtconfigts)
  - [Plugins](#plugins)
  - [ Composable Functions ( Like react custom hooks )](#-composable-functions--like-react-custom-hooks-)
  - [Modules](#modules)
  - [Meta Tags ( SEO )](#meta-tags--seo-)
  - [ State Management](#-state-management)
  - [Server \& API endpoints \& Routes](#server--api-endpoints--routes)
  - [ Nitro](#-nitro)
  - [useFetch](#usefetch)
  - [useLazyFetch](#uselazyfetch)
  - [useAsyncData](#useasyncdata)
  - [ℹ asyncData and fetch](#ℹ-asyncdata-and-fetch)
  - [Lifecycle Hooks \[ Advanced \]](#lifecycle-hooks--advanced-)
  - [Nuxt Content \[ Full Static Content \]](#nuxt-content--full-static-content-)
  - [Creating \& Deleting a branch](#creating--deleting-a-branch)

## File based routing

Nuxt uses the file system to generate routes. Every file in the `pages` directory will be used to generate a route.

```
pages/index.vue => /
pages/about.vue => /about
pages/products/index.vue => /products
pages/products/[id].vue => /products/:id
```

## Layouts

Layouts are used to wrap pages with common UI components. They are defined in the `layouts` directory. We can create single Root Layout or multiple layouts.

```
layouts/default.vue
layouts/admin.vue
```

If we want to use custom layout for a page, we can do that by adding layout property to the page.

```ts
<script setup>
definePageMeta({
  layout: 'name of layout',
});
</script>
```

## Assets & Public Directories

Assets and Public directories are used to store static files like images, fonts, etc.

- Assets are defined in the `assets` directory and preprocessed by webpack. They can be cached by browser.
- Public directory is used to store and serve static files in public server. Files in this directory are not processed by webpack and are served as is. They are not cached by browser. Also they are available in the app.
- If we want to use a svg file as a component, we can use <a href="https://icones.js.org/">Icones</a> library to create an icon component with that svg file.

## Middleware ( Authentication, etc. )

Middleware are functions that run before a request is processed. They are defined in the `middleware` directory. It works before navigating to a particular route. There are three kinds of route middleware:

- Anonymous middleware: Which are defined in the pages where they are used.
- Named route middleware: Which are defined in the `middleware` directory.
- Global middleware: Which are defined in the `nuxt.config.ts` file.

```ts
// middleware/auth.ts
export default function ({ store, redirect }) {
  if (!store.state.user) {
    return navigateTo('/login');
  }
}
```

to use this middleware, we need to add it to the route in `nuxt.config.ts` file.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  middleware: ['auth'],
});
```

Also we can define global middleware with the name of the file containing `.global` extension.

```ts
// middleware/auth.global.ts
export default function ({ to, from }) {****
  if (!store.state.user) {
    return navigateTo('/login');****
  }
}
```

Or in any page we can use it like this:

```ts
definePageMeta({
  middleware: 'auth',
});
```

## Server-Side Rendering (SSR) and Static Site Generation (SSG)

Nuxt supports both SSR and SSG. SSR is the default mode and SSG is used to pre-render pages at build time.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Server-side rendering
  target: 'static', // Static site generation
});
```

## Server Actions with API Routes (Serverless Functions)

Nuxt provides a way to handle server actions with API routes. API routes are defined in the `api` directory.

```ts
// api/products.ts
export default defineEventHandler(async (event) => {
  return { message: 'Hello World' };
});
```

## Project Structure with Nuxt.config.ts

Nuxt.config.ts is the main configuration file for Nuxt. It is used to configure the project, plugins, middleware, etc.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/styles/main.css'],
  plugins: ['~/plugins/axios.ts'],
  modules: ['@nuxtjs/tailwindcss'],
  buildModules: ['@pinia/nuxt'],
  ssr: true,
  target: 'static',
  // TypeScript configuration
  typescript: {
    strict: true, // Enables strict TypeScript checks
    typeCheck: true, // Type errors will be checked at build time
  },
  // Runtime configuration
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'https://api.example.com',
    },
    secretKey: process.env.SECRET_KEY || 'default-secret', // Server-only secret
  },
  // PostCSS configuration
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // Auto imports and Aliases
  components: true,
  alias: {
    '@': '/<rootDir>/',
    '@components': '/<rootDir>/components',
    '@composables': '/<rootDir>/composables',
  },
  // Performance optimizations
  build: {
    extractCSS: true, // Extract CSS into separate files for better caching
  },
  render: {
    http2: {
      push: true,
      pushAssets: (req, res, publicPath, preloadFiles) =>
        preloadFiles
          .filter((f) => f.asType === 'script' || f.asType === 'style')
          .map((f) => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`),
    },
    static: {
      maxAge: 60 * 60 * 24 * 365, // Cache static assets for one year
    },
  },
});
```

## Plugins

Plugins are used to extend the functionality of Nuxt. They are defined in the `plugins` directory.

```ts
// plugins/axios.ts
import axios from 'axios';

export default defineNuxtPlugin(() => {
  const instance = axios.create({
    baseURL: process.env.API_URL || 'https://api.example.com',
  });

  return {
    provide: {
      axios: instance,
    },
  };
});
```

This plugin can be used globally with `useNuxtApp().$axios`.

## <img src="https://vueuse.org/favicon.svg" width="30" /> Composable Functions ( Like react custom hooks )

Composable functions are used to encapsulate logic and share it across components. They are defined in the `composables` directory. This specially useful for reusable logic like API calls, state management, etc. They can be auto-imported by Nuxt. Following are some examples of what we can do with composable functions:

- API requests
- Local storage operations
- User authentication processes
- Theme and language change management
- Global state management (without needing Vuex or Pinia for simple states)
- Also there is a very useful library called <a href="https://vueuse.org/">VueUse</a> that provides a lot of composable functions for common tasks.

Here is an example of a composable function that handles user authentication:

```ts
// composables/useAuth.ts
export const useAuth = () => {
  const user = useState('user', () => null); // Global user state

  const login = (username: string, password: string) => {
    // Simple login check
    if (username === 'admin' && password === 'password') {
      user.value = { name: 'admin', role: 'admin' }; // User information
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    user.value = null; // User session end
  };

  const isAuthenticated = () => {
    return !!user.value; // Is user authenticated?
  };

  return {
    user,
    login,
    logout,
    isAuthenticated,
  };
};
```

## Modules

Modules are used to extend the functionality and speed up the development process of Nuxt. They are defined in the `modules` directory.

- @nuxtjs/axios: API requests with Axios.
- @nuxtjs/auth-next: User authentication and session management.
- @pinia/nuxt: Global state management.
- @nuxtjs/tailwindcss: Styling with Tailwind CSS.
- @nuxt/image: Image optimization and lazy loading.

## Meta Tags ( SEO )

Nuxt provides a way to handle meta tags with the `head` method.

```ts
// pages/products/[id].vue
export default {
  head: {
    title: 'Product Page',
    meta: [
      { name: 'description', content: 'This is a product page' },
      { property: 'og:title', content: 'Product Page' },
    ],
  },
};
```

- Also we can configure some settings in `nuxt.config.ts` file, we can use `useHead()` composable in pages and we can use prebuilt components like `<Head />`, `<Title />` and more to define titles or meta tags about SEO. <a href="https://nuxt.com/docs/getting-started/seo-meta#components">Check out the documentation </a>

## <img src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Pinialogo.svg" width="30" /> State Management

Nuxt 3 a way to manage state management on globally accessible. This allow us to do not use any other state management library like Pinia. Pinia is what you get if you keep adding more and more features to `useState`. More complex apps will benefit from the extra features in Pinia, but useState is better for small and simple apss.

```ts
// composables/states.ts
export const useCounter = () => useState<number>('counter', () => 0);
```

## Server & API endpoints & Routes

You can easily manage the server-only part of your Nuxt app, from API endpoints to middleware.

Both endpoints and middleware can be defined like this:

```ts
// server/api/test.ts
export default defineEventHandler(async (event) => {
  // ... Do whatever you want here
});
```

or we can also create `routes` folder without use /api prefix.

```ts
// server/routes/test.ts
export default defineEventHandler(async (event) => {
  // ... Do whatever you want here
});
```

for best practice we must use suffix on our api routes to ensure the endpoint does which action.
For example `hello.get.ts` or `hello.post.ts`. With this the hello endpoint does only get or post request.

## <img src="https://nitro.unjs.io/icon.svg" width="30" /> Nitro

Nitro is an open source TypeScript framework to build ultra-fast web servers. Nuxt uses Nitro as its server engine.

## useFetch

This composable provides a convenient wrapper around useAsyncData and $fetch. It automatically generates a key based on URL and fetch options, provides type hints for request url based on server routes, and infers API response type. It returns `data, status, error, refresh` and more which is very useful. But useFetch bloks ui until data is arrive. It could work both on SSR and CSR.

```ts
<script setup lang="ts">
const { data, status, error, refresh, clear } = await useFetch('/api/modules', {
  pick: ['title']
})
</script>
```

## useLazyFetch

Same as `useFetch` but useful for displaying loaders while data is fetching. It could work both on SSR and CSR.

## useAsyncData

Within your pages, components, and plugins you can use useAsyncData to get access to data that resolves asynchronously.

```ts
// pages/index.vue
<script setup lang="ts">
const { data, status, error, refresh, clear } = await useAsyncData(
  'mountains',
  () => $fetch('https://api.nuxtjs.dev/mountains')
)
</script>
```

## ℹ asyncData and fetch

Nuxt provides a way to handle async data with the `asyncData` method. It is used to fetch data from the server before rendering the page.

```ts
// pages/products/[id].vue
export default {
  async asyncData({ $axios, params }) {
    const { data } = await $axios.get(`/products/${params.id}`);
    return { product: data };
  },
};
```

## Lifecycle Hooks [ Advanced ]

Also there is built in hooks for certain situations. Checkout the <a href="https://nuxt.com/docs/guide/going-further/hooks"> documentation </a> for more information.

## Nuxt Content [ Full Static Content ]

- Nuxt Content reads the `content/` directory in your project and parses `.md, .yml, .csv and .json` files to create a file-based CMS for your application.
- Nuxt content also allow us to write normal texts in markdown without configurate HTML, CSS or Javascript. Checkout the <a href="https://nuxt.com/docs/guide/directory-structure/content">documentation</a> for more information.
- Also to able to use some `themes` in your Nuxt Content markdown you can check <a href="https://docus.dev/">Docus</a>.

## Creating & Deleting a branch

- `git checkout -b new_branch_name` creates a branch and `git push origin new_branch_name` sends branch to the remote repository.
- `git branch -d branch_name` deletes current branch and `git push origin --delete branch_name`. deletes the branch from the remote repository.
