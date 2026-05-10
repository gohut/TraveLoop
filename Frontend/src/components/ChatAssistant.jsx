import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTravelApp } from '../context/TravelAppContext'

function buildReply(message, location, trips) {
  const text = message.trim().toLowerCase()
  const currentTrip = trips[0]

  if (text.includes('budget') || text.includes('cost')) {
    return currentTrip
      ? `${currentTrip.name} is currently tracking transport, stay, meals, and activities. Open the budget screen for a full breakdown and over-budget day alerts.`
      : 'You can use the budget screen to track transport, stay, meals, and activities in one place.'
  }

  if (text.includes('trip') || text.includes('plan')) {
    return currentTrip
      ? `Your fastest next step is to open ${currentTrip.name}, add cities in the itinerary builder, and then assign activities to each stop.`
      : 'Start with Create Trip, then add stops in the itinerary builder and activities for each city.'
  }

  if (text.includes('city') || text.includes('destination')) {
    return 'Use City Search to filter by region or country, then add destinations directly into the trip you are building.'
  }

  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return `Hello. You are currently on ${location.pathname}. I can help you navigate trips, itineraries, budgets, notes, and packing.`
  }

  return 'I can help with trip setup, cities, activities, budgets, packing, notes, and navigation through the planner.'
}

function ChatAssistant() {
  const { trips } = useTravelApp()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        'Travel Loop Assistant is here. Ask about trip planning, budgets, destinations, or how to use any page.',
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isOpen])

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedMessage = inputValue.trim()

    if (!trimmedMessage) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), role: 'user', content: trimmedMessage },
    ])
    setInputValue('')
    setIsTyping(true)

    window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: buildReply(trimmedMessage, location, trips),
        },
      ])
      setIsTyping(false)
    }, 600)
  }

  return (
    <div className="chatbot-shell">
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <h2>Travel Loop Assistant</h2>
              <p>Ask for help with routes, trip planning, budgets, or itinerary flow.</p>
            </div>
            <button
              type="button"
              className="chatbot-close"
              aria-label="Close chatbot"
              onClick={() => setIsOpen(false)}
            >
              x
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chatbot-message ${message.role}`}>
                {message.content}
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-message assistant typing" aria-label="Assistant typing">
                <span className="chatbot-dot" />
                <span className="chatbot-dot" />
                <span className="chatbot-dot" />
              </div>
            )}

            <div ref={endRef} />
          </div>

          <form className="chatbot-form" onSubmit={handleSubmit}>
            <input
              className="chatbot-input"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask about this page or your trip"
            />
            <button type="submit" className="chatbot-send">
              Send
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button
          type="button"
          className="chatbot-toggle"
          aria-label="Open chatbot"
          onClick={() => setIsOpen(true)}
        >
          AI
        </button>
      )}
    </div>
  )
}

export default ChatAssistant
