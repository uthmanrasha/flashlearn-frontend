<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Flashcard = {
  id: number
  subject: string
  question: string
  answer: string
  difficultyLevel: string
}

const API_URL = 'https://flashcardbackend-ddkh.onrender.com'

const flashcards = ref<Flashcard[]>([])
const subject = ref('')
const question = ref('')
const answer = ref('')
const difficultyLevel = ref('Medium')

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')

async function loadFlashcards() {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${API_URL}/flashcards`)

    if (!response.ok) {
      throw new Error('Fehler beim Laden')
    }

    flashcards.value = (await response.json()) as Flashcard[]
  } catch {
    error.value = 'Die Lernkarten konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function addFlashcard() {
  saving.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await fetch(`${API_URL}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: subject.value,
        question: question.value,
        answer: answer.value,
        difficultyLevel: difficultyLevel.value,
      }),
    })

    if (!response.ok) {
      throw new Error('Fehler beim Speichern')
    }

    const savedFlashcard = (await response.json()) as Flashcard
    flashcards.value.unshift(savedFlashcard)

    subject.value = ''
    question.value = ''
    answer.value = ''
    difficultyLevel.value = 'Medium'
    success.value = 'Die Lernkarte wurde gespeichert.'
  } catch {
    error.value = 'Die Lernkarte konnte nicht gespeichert werden.'
  } finally {
    saving.value = false
  }
}

onMounted(loadFlashcards)
</script>

<template>
  <section>
    <h2>Neue Lernkarte</h2>

    <form @submit.prevent="addFlashcard">
      <label>
        Fach
        <input v-model="subject" required />
      </label>

      <label>
        Frage
        <input v-model="question" required />
      </label>

      <label>
        Antwort
        <textarea v-model="answer" required />
      </label>

      <label>
        Schwierigkeit
        <select v-model="difficultyLevel">
          <option>Einfach</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </label>

      <button type="submit" :disabled="saving">
        {{ saving ? 'Wird gespeichert …' : 'Lernkarte speichern' }}
      </button>
    </form>

    <p v-if="success">{{ success }}</p>
    <p v-if="error">{{ error }}</p>

    <h2>Beispiel-Lernkarten</h2>

    <p v-if="loading">Lernkarten werden geladen …</p>

    <article v-for="card in flashcards" :key="card.id" class="card">
      <h3>{{ card.question }}</h3>
      <p><strong>Fach:</strong> {{ card.subject }}</p>
      <p><strong>Antwort:</strong> {{ card.answer }}</p>
      <p><strong>Schwierigkeit:</strong> {{ card.difficultyLevel }}</p>
    </article>
  </section>
</template>

<style scoped>
form {
  display: grid;
  gap: 12px;
  max-width: 500px;
  margin-bottom: 24px;
}

label {
  display: grid;
  gap: 6px;
}

input,
textarea,
select,
button {
  padding: 10px;
  font: inherit;
}

textarea {
  min-height: 80px;
}

.card {
  margin: 12px 0;
  padding: 16px;
  border: 1px solid #42b883;
  border-radius: 10px;
}
</style>
