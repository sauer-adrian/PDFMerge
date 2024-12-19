<template>
  <div class="flex w-full h-full space-x-4">
    <!-- Left Section: 2/3 width for Drop Area -->
    <div class="w-2/3 flex flex-col items-center space-y-4" @dragover.prevent @drop="handleDrop">
      <!-- Drag-and-Drop Area with fixed height and centered text -->
      <div
        class="drop-area w-full p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer flex items-center justify-center"
        @click="selectFiles" @dragover.prevent @drop="handleDrop">
        <p class="text-gray-600 dark:text-gray-300">Drag PDF files here or click to select them</p>
      </div>
    </div>

    <!-- Right Section: 1/3 width for File List -->
    <div class="w-1/3 flex flex-col items-start space-y-4">
      <!-- Fake File List with Skeleton -->
      <div v-if="files.length === 0" class="space-y-4 w-full">
        <!-- Fake file skeleton loaders resembling file list -->
        <div v-for="i in 3" :key="i" class="flex justify-between items-center space-x-4  px-2 pb-2 border-b">
          <div class="flex-1 space-y-2">
            <!-- Skeleton lines for file name -->
            <USkeleton class="h-4 w-full" />
          </div>
          <!-- Skeleton for "remove" button -->
          <USkeleton class="h-6 w-6 rounded-full" />
        </div>
        <USkeleton class="h-8 w-full" />
      </div>

      <!-- Real File List with Drag-and-Drop Sorting -->
      <client-only>
        <draggable v-model="files" class="w-full" tag="ul" item-key="name" animation="200" @start="onDragStart"
          @end="onDragEnd">
          <!-- Define the slot for each draggable item -->
          <template #item="{ element, index }">
            <li :key="element.name" class="flex justify-between items-center px-4 py-2 border-b"
              @mouseover="setDragHoverCursor" @mousedown="draggingStyle" @mouseleave="resetCursor"
              :style="draggingIndex === index ? draggingStyle : {}">
              <span class="truncate">{{ index + 1 }}. {{ element.name }}</span>
              <UButton icon="i-heroicons-trash-20-solid" size="small" variant="danger" @click="removeFile(index)">
              </UButton>
            </li>
          </template>
        </draggable>
      </client-only>



      <div class="w-full" v-if="files.length !== 0">
        <UButton block class="w-full" @click="mergeAndDownloadFiles">
          Merge
        </UButton>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PDFDocument } from 'pdf-lib'
import draggable from 'vuedraggable'

const files = ref([])

const draggingIndex = ref(null) // Track the index of the item being dragged

// Cursor styles
const draggingStyle = (e) => {
  if (e.target.tagName === 'LI') {
    e.target.style.cursor = 'grabbing'
  }
}

const setDragHoverCursor = (e) => {
  // Change cursor to "move" when hovering over a draggable item
  if (e.target.tagName === 'LI') {
    e.target.style.cursor = 'grab'
  }
}

const resetCursor = (e) => {
  // Reset cursor when leaving the draggable item
  e.target.style.cursor = ''
}

// Helper function to check and add unique files
const addUniqueFiles = (newFiles) => {
  newFiles.forEach((newFile) => {
    if (!files.value.some((existingFile) => existingFile.name === newFile.name && existingFile.lastModified === newFile.lastModified)) {
      files.value.push(newFile)
    }
  })
}

// Select files using file input
const selectFiles = async () => {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'application/pdf'
  fileInput.multiple = true
  fileInput.onchange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    addUniqueFiles(selectedFiles)
  }
  fileInput.click()
}

// Handle drag-and-drop files
const handleDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()

  const droppedFiles = Array.from(e.dataTransfer.files).filter(
    (file) => file.type === 'application/pdf'
  )
  addUniqueFiles(droppedFiles)
}

// Remove a file from the list
const removeFile = (index) => {
  files.value.splice(index, 1)
}

// Merge and download PDF files
const mergeAndDownloadFiles = async () => {
  const mergedPdf = await PDFDocument.create()

  for (const file of files.value) {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
    pages.forEach((page) => mergedPdf.addPage(page))
  }

  const mergedPdfBytes = await mergedPdf.save()
  const mergedPdfUrl = URL.createObjectURL(new Blob([mergedPdfBytes], { type: 'application/pdf' }))

  const link = document.createElement('a')
  link.href = mergedPdfUrl
  link.download = 'merged.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Drag start and end handlers
const onDragStart = (e) => {
  draggingIndex.value = e.oldIndex
  document.body.style.cursor = 'grabbing' // Change cursor when drag starts
}

const onDragEnd = () => {
  draggingIndex.value = null
  document.body.style.cursor = '' // Reset cursor when drag ends
}
</script>

<style scoped>
/* Styling the drop area */
.drop-area {
  height: 200px;
  /* Fixed height for the drop area */
}

.cursor-pointer {
  cursor: pointer;
  /* Makes the area act like a clickable button */
}
</style>
