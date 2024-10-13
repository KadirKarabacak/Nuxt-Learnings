import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {
  // We can use nuxtApp to provide global variables or functions
  return {
    provide: {
      sayHello: (msg: string) => {
        console.log(`Hello ${msg}`);
      },
    },
  };
});
