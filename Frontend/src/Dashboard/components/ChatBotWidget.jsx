import { useEffect, useRef, useState } from 'react'

function buildReply(message, highlightedCity) {
  const text = message.trim().toLowerCase()

  if (!text) {
    return `Tell me what you'd like help with and I can shape ideas around ${highlightedCity.title}.`
  }

  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return `Hello. I can help you explore destinations, budgets, and trip ideas. Right now the map is focused on ${highlightedCity.title}.`
  }

  if (
    text.includes('budget') ||
    text.includes('cost') ||
    text.includes('cheap') ||
    text.includes('price')
  ) {
    return `For a balanced luxury plan, start with flights plus hotel first, then set aside 20% for experiences. If you want, I can sketch a budget around ${highlightedCity.location}.`
  }

  if (
    text.includes('city') ||
    text.includes('destination') ||
    text.includes('where') ||
    text.includes('travel')
  ) {
    return `${highlightedCity.title} is a strong pick if you want a polished city experience. I can also suggest alternatives based on romance, nightlife, nature, or budget.`
  }

  if (
    text.includes('trip') ||
    text.includes('itinerary') ||
    text.includes('plan') ||
    text.includes('days')
  ) {
    return `A simple flow is day 1 arrival and check-in, day 2 signature landmark visit, day 3 local food and hidden spots, and day 4 a relaxed departure. I can personalize that for ${highlightedCity.title}.`
  }

  if (
    text.includes('food') ||
    text.includes('restaurant') ||
    text.includes('eat')
  ) {
    return `I would plan one signature dinner, one neighborhood cafe stop, and one local specialty tasting so the trip feels memorable without being overbooked.`
  }

  return `I can help with destination ideas, budgets, itineraries, and trip inspiration. If you want, ask me something like "plan a 3 day trip" or "give me a budget for ${highlightedCity.title}".`
}

function ChatBotWidget({ highlightedCity }) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        'I am your Travel Loop assistant. Ask about destinations, budgets, or itinerary ideas and I will reply instantly.',
    },
  ])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isOpen])

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedMessage = inputValue.trim()

    if (!trimmedMessage) {
      return
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmedMessage,
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setInputValue('')
    setIsTyping(true)

    window.setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: buildReply(trimmedMessage, highlightedCity),
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
      setIsTyping(false)
    }, 700)
  }

  return (
    <div className="chatbot-shell">
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <h2>Travel Loop Assistant</h2>
              <p>Ask for ideas, costs, or a quick trip outline.</p>
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
              <div
                key={message.id}
                className={`chatbot-message ${message.role}`}
              >
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

            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-form" onSubmit={handleSubmit}>
            <input
              className="chatbot-input"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={`Ask about ${highlightedCity.title} or any travel plan`}
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

export default ChatBotWidget
