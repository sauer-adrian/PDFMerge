<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const navLinks = [
  //{ name: 'About', href: '/about' },
  //{ name: 'Contact', href: '/contact' }
]
</script>

<template>
  <header class="flex items-center justify-between p-4 bg-white dark:bg-slate-800">
    <div class="flex items-center space-x-4">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" class="h-8 w-8" />
        <span class="text-lg font-bold text-gray-800 dark:text-white">PDFMerge</span>
      </NuxtLink>
    </div>

    <nav class="flex-grow ml-8">
      <ul class="flex space-x-6">
        <li v-for="link in navLinks" :key="link.name">
          <a :href="link.href" class="text-gray-800 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">
            {{ link.name }}
          </a>
        </li>
      </ul>
    </nav>

    <div class="flex items-center space-x-4">
      <UButton v-if="isMounted" :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="gray"
        variant="ghost" aria-label="Theme" @click="isDark = !isDark" />
    </div>
  </header>
  <main>
    <slot />
  </main>
</template>
