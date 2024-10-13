<script lang="ts" setup></script>

<template>
  <div class="CustomLayout bg-stone-600 h-screen text-white">
    Custom Layout
    <!-- Inside layout we have to display pages with <slot /> -->
    <slot />
  </div>
</template>

<style lang="scss" scoped></style>
