<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
]
</script>

<template>
  <header class="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
    <!-- Logo Section -->
    <div class="flex items-center space-x-4">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" class="h-8 w-8" />
        <span class="text-lg font-bold dark:text-white">PDFMerge</span>
      </NuxtLink>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-grow ml-8">
      <ul class="flex space-x-6">
        <li v-for="link in navLinks" :key="link.name">
          <a
            :href="link.href"
            class="text-gray-800 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
          >
            {{ link.name }}
          </a>
        </li>
      </ul>
    </nav>

    <!-- Dark Mode Toggle -->
    <div>
      <UButton
        :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
        color="gray"
        variant="ghost"
        aria-label="Theme"
        @click="isDark = !isDark"
      />
    </div>
  </header>
  <main>
    <slot />
  </main>
</template>