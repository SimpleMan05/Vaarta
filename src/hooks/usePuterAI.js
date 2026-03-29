import { useState, useCallback } from 'react'
import { buildTranslationPrompt } from '../utils/languages'
import { usePuter } from '../context/PuterContext'

export function usePuterAI() {
  const { status } = usePuter()
  const [loading, setLoading]       = useState(false)   // true while stream is open
  const [streaming, setStreaming]   = useState(false)   // true only during active token flow
  const [streamText, setStreamText] = useState('')      // raw accumulated JSON string
  const [error, setError]           = useState(null)
  const [result, setResult]         = useState(null)

  const translate = useCallback(async (articleText, languageCode) => {
    setLoading(true)
    setStreaming(false)
    setStreamText('')
    setError(null)
    setResult(null)

    try {
      if (typeof window.puter === 'undefined') {
        throw new Error('Puter.js is not loaded. Please refresh the page.')
      }
      if (status !== 'ready') {
        throw new Error('Puter is not connected yet. Please wait or click "Connect" in the header.')
      }

      const prompt = buildTranslationPrompt(articleText, languageCode)

      // ── Streaming call ────────────────────────────────────────────
      const response = await window.puter.ai.chat(prompt, {
        model: 'gpt-4o',
        stream: true,
      })

      setStreaming(true)
      let accumulated = ''

      for await (const part of response) {
        // Puter streams chunks as { text } or plain strings
        const token =
          part?.text ??
          part?.choices?.[0]?.delta?.content ??
          (typeof part === 'string' ? part : '')

        if (token) {
          accumulated += token
          setStreamText(accumulated)   // triggers live preview re-render
        }
      }

      setStreaming(false)

      // ── Parse completed JSON ──────────────────────────────────────
      const cleaned = accumulated
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()

      let parsed
      try {
        parsed = JSON.parse(cleaned)
      } catch {
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('AI returned an unexpected format. Please try again.')
        }
      }

      setResult(parsed)
      return parsed

    } catch (err) {
      setStreaming(false)
      const message = err?.message || 'Translation failed. Please try again.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [status])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setLoading(false)
    setStreaming(false)
    setStreamText('')
  }, [])

  return { translate, loading, streaming, streamText, error, result, reset }
}
