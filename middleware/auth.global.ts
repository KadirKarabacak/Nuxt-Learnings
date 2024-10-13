// If the file name contains .global, it will be applied to all routes.
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = false;

  if (isLoggedIn) navigateTo(to.fullPath);

  return navigateTo('/login');
});
