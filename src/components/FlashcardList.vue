<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Flashcard = {
  id: number
  subject: string
  question: string
  answer: string
  difficultyLevel: string
}

const flashcards = ref<Flashcard[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const response = await fetch('https://flashcardbackend-ddkh.onrender.com/flashcards')

    if (!response.ok) {
      throw new Error('Fehler beim Laden')
    }

    flashcards.value = (await response.json()) as Flashcard[]
  } catch {
    error.value = 'Die Lernkarten konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <h2>Beispiel-Lernkarten</h2>

    <p v-if="loading">Lernkarten werden geladen …</p>
    <p v-else-if="error">{{ error }}</p>

    <article v-for="card in flashcards" :key="card.id" class="card">
      <h3>{{ card.question }}</h3>
      <p><strong>Fach:</strong> {{ card.subject }}</p>
      <p><strong>Antwort:</strong> {{ card.answer }}</p>
      <p><strong>Schwierigkeit:</strong> {{ card.difficultyLevel }}</p>
    </article>
  </section>
</template>

<style scoped>
.card {
  margin: 12px 0;
  padding: 16px;
  border: 1px solid #42b883;
  border-radius: 10px;
}
</style>
