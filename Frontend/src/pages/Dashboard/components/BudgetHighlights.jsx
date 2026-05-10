import { useEffect, useState } from 'react'
import CarouselDots from './CarouselDots'

function BudgetHighlights({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = items[activeIndex]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % items.length)
    }, 5200)

    return () => window.clearInterval(intervalId)
  }, [items.length])

  return (
    <div className="showcase-shell">
      <article className="showcase-card showcase-budget">
        <div className="showcase-image-wrap">
          <img src={activeItem.image} alt={activeItem.title} />
          <div className="showcase-budget-price">
            <strong>{activeItem.price}</strong>
            <span>Per person</span>
          </div>
        </div>

        <div className="showcase-body">
          <p className="showcase-eyebrow">Budget Highlights</p>
          <h2 className="showcase-title">{activeItem.title}</h2>
          <p className="showcase-copy">{activeItem.details}</p>
          <p className="showcase-meta">{activeItem.duration}</p>
        </div>
      </article>

      <CarouselDots
        count={items.length}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />
    </div>
  )
}

export default BudgetHighlights
