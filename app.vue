<template>
  <div class="h-screen w-screen bg-stone-800 text-white">
   <NuxtLayout>
    <ul>
      <li>
        <NuxtLink to="/">Home</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/events">Events</NuxtLink>
      </li>
    </ul>
    <NuxtPage /> 
   </NuxtLayout>
  </div>
</template>
