import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Slider.scss';

export interface SlideData {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface SliderProps {
  slides: SlideData[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const DEFAULT_INTERVAL = 5000;

export const Slider: React.FC<SliderProps> = ({
  slides,
  autoPlay = true,
  autoPlayInterval = DEFAULT_INTERVAL,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startInterval = () => {
    if (!autoPlay) return;
    stopInterval();
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
  };

  useEffect(() => {
    startInterval();
    return () => stopInterval();
  }, [autoPlay, autoPlayInterval, slides.length]);

  const handleNext = () => {
    stopInterval();
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevious = () => {
    stopInterval();
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleDotClick = (index: number) => {
    stopInterval();
    setActiveIndex(index);
  };

  if (!slides.length) {
    return null;
  }

  const translateX = -activeIndex * 100;

  return (
    <div className={`slider ${className}`}>
      <div className="slider__container">
        <div
          className="slider__track"
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="slider__slide">
              {slide.imageUrl && (
                <div
                  className="slider__image"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                />
              )}
              <div className="slider__content">
                <h3 className="slider__title">{slide.title}</h3>
                <p className="slider__description">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="slider__controls">
        <button
          className="slider__button slider__button--prev"
          onClick={handlePrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="slider__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider__dot ${
                activeIndex === index ? 'slider__dot--active' : ''
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          className="slider__button slider__button--next"
          onClick={handleNext}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

Slider.displayName = 'Slider';

