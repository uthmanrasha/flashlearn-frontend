<script setup lang="ts">
const flashcards = [
  {
    id: 1,
    subject: 'Informatik',
    question: 'Was ist Polymorphie?',
    answer: 'Ein Konzept in der objektorientierten Programmierung.',
    difficultyLevel: 'Hard',
  },
  {
    id: 2,
    subject: 'Biologie',
    question: 'Was ist die Aufgabe der Mitochondrien?',
    answer: 'Mitochondrien sind die Kraftwerke der Zelle.',
    difficultyLevel: 'Medium',
  },
]
</script>

<template>
  <section>
    <h2>Beispiel-Lernkarten</h2>

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
