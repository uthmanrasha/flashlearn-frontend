import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import FlashcardList from '../FlashcardList.vue'

const apiUrl = 'https://flashcardbackend-ddkh.onrender.com'
const fetchMock = vi.fn<typeof fetch>()

function jsonResponse(body: unknown): Response {
  return {
    ok: true,
    json: async () => body,
  } as Response
}

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('FlashcardList', () => {
  it('zeigt geladene Lernkarten an', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse([
        {
          id: 1,
          subject: 'Informatik',
          question: 'Was ist Polymorphie?',
          answer: 'Ein Konzept der objektorientierten Programmierung.',
          difficultyLevel: 'Hard',
        },
      ]),
    )

    const wrapper = mount(FlashcardList)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(`${apiUrl}/flashcards`)
    expect(wrapper.text()).toContain('Was ist Polymorphie?')
    expect(wrapper.text()).toContain('Informatik')
  })

  it('sendet eine neue Lernkarte und zeigt sie an', async () => {
    const savedCard = {
      id: 2,
      subject: 'Biologie',
      question: 'Was machen Mitochondrien?',
      answer: 'Sie sind die Kraftwerke der Zelle.',
      difficultyLevel: 'Medium',
    }

    fetchMock.mockResolvedValueOnce(jsonResponse([])).mockResolvedValueOnce(jsonResponse(savedCard))

    const wrapper = mount(FlashcardList)
    await flushPromises()

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Biologie')
    await inputs[1].setValue('Was machen Mitochondrien?')
    await wrapper.find('textarea').setValue('Sie sind die Kraftwerke der Zelle.')
    await wrapper.find('select').setValue('Medium')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${apiUrl}/flashcards`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Biologie',
          question: 'Was machen Mitochondrien?',
          answer: 'Sie sind die Kraftwerke der Zelle.',
          difficultyLevel: 'Medium',
        }),
      }),
    )
    expect(wrapper.text()).toContain('Die Lernkarte wurde gespeichert.')
    expect(wrapper.text()).toContain('Was machen Mitochondrien?')
  })
})
