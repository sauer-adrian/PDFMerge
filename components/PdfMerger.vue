<template>
    <div
      class="flex flex-col items-center p-6 space-y-4 border border-gray-200 rounded-lg"
      @dragover.prevent
      @drop="handleDrop"
    >
      <h2 class="text-xl font-semibold">PDF Zusammenfügen</h2>
  
      <!-- Drag-and-Drop Area -->
      <div
        class="w-full p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
        @dragover.prevent
        @drop="handleDrop"
      >
        <p class="text-gray-600 dark:text-gray-300">Dateien hierher ziehen oder</p>
        <UButton block @click="selectFiles">Dateien auswählen</UButton>
      </div>
  
      <!-- File List -->
      <ul class="w-full list-disc list-inside">
        <li v-for="(file, index) in files" :key="index">{{ file.name }}</li>
      </ul>
  
      <UButton block @click="mergeAndDownloadFiles" :disabled="files.length === 0">
        Dateien zusammenfügen
      </UButton>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { PDFDocument } from 'pdf-lib'
  
  const files = ref([])
  
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
  </script>
  
  <style scoped>
  /* Styling for the drag-and-drop area */
  </style>
  