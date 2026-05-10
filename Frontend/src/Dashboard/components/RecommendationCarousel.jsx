import { useEffect, useState } from 'react'
import CarouselDots from './CarouselDots'

function RecommendationCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = items[activeIndex]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % items.length)
    }, 5600)

    return () => window.clearInterval(intervalId)
  }, [items.length])

  return (
    <div className="showcase-shell">
      <article className="showcase-card showcase-recommendation">
        <div className="showcase-image-wrap">
          <img src={activeItem.image} alt={activeItem.title} />
        </div>

        <div className="showcase-body">
          <p className="showcase-eyebrow">Our Recommendation</p>
          <h2 className="showcase-title">{activeItem.title}</h2>
          <p className="showcase-copy">{activeItem.subtitle}</p>
          <div className="showcase-tags">
            {activeItem.tags.map((tag) => (
              <span key={tag} className="showcase-tag">
                {tag}
              </span>
            ))}
          </div>
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

export default RecommendationCarousel
