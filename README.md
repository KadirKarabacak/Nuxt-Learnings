# Nuxt Learnings Repo

This repo is a collection of my learnings and experiments with Nuxt.

- [Nuxt Learnings Repo](#nuxt-learnings-repo)
  - [File based routing](#file-based-routing)
  - [Layouts](#layouts)
  - [Middleware ( Authentication, etc. )](#middleware--authentication-etc-)
  - [Server-Side Rendering (SSR) ve Static Site Generation (SSG)](#server-side-rendering-ssr-ve-static-site-generation-ssg)
  - [Server Actions with API Routes (Serverless Functions)](#server-actions-with-api-routes-serverless-functions)
  - [Project Structure with Nuxt.config.ts](#project-structure-with-nuxtconfigts)
  - [Plugins](#plugins)
  - [Composable Functions ( Like react custom hooks )](#composable-functions--like-react-custom-hooks-)
  - [Modules](#modules)
  - [Meta Tags ( SEO )](#meta-tags--seo-)
  - [Async Data and Fetch](#async-data-and-fetch)

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

## Middleware ( Authentication, etc. )

Middleware are functions that run before a request is processed. They are defined in the `middleware` directory.

```ts
// middleware/auth.ts
export default function ({ store, redirect }) {
  if (!store.state.user) {
    return redirect('/login');
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

## Server-Side Rendering (SSR) ve Static Site Generation (SSG)

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

## Composable Functions ( Like react custom hooks )

Composable functions are used to encapsulate logic and share it across components. They are defined in the `composables` directory. This specially useful for reusable logic like API calls, state management, etc. Following are some examples of what we can do with composable functions:

- API requests
- Local storage operations
- User authentication processes
- Theme and language change management
- Global state management (without needing Vuex or Pinia for simple states)

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

## Async Data and Fetch

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
