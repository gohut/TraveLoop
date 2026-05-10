function CarouselDots({ count, activeIndex, onChange }) {
  return (
    <div className="carousel-dots" aria-label="Carousel navigation">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          className={`carousel-dot ${index === activeIndex ? 'is-active' : ''}`}
          aria-label={`Show item ${index + 1}`}
          aria-pressed={index === activeIndex}
          onClick={() => onChange(index)}
        />
      ))}
    </div>
  )
}

export default CarouselDots
