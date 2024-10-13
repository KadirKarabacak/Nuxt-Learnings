<script setup lang="ts">
import { useCounterStore } from '../stores/myStore';
const store = useCounterStore()

</script>

<template>
  <Counter />
</template>
