import CarouselDots from './CarouselDots'

function TopCitiesCarousel({ items, activeIndex, onChange }) {
  const activeItem = items[activeIndex]

  return (
    <div className="showcase-shell">
      <article className="showcase-card showcase-city">
        <div className="showcase-image-wrap">
          <img src={activeItem.image} alt={activeItem.title} />
        </div>

        <div className="showcase-body">
          <p className="showcase-eyebrow">Top Cities To Travel</p>
          <div className="showcase-title-row">
            <div>
              <h2 className="showcase-title">{activeItem.title}</h2>
              <p className="showcase-meta">{activeItem.location}</p>
            </div>
            <span className="showcase-badge">{activeItem.rating} / 5</span>
          </div>
          <p className="showcase-copy">{activeItem.subtitle}</p>
        </div>
      </article>

      <CarouselDots count={items.length} activeIndex={activeIndex} onChange={onChange} />
    </div>
  )
}

export default TopCitiesCarousel
