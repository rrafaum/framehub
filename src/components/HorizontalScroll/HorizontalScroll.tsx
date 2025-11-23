"use client";

import { useRef, useState, MouseEvent } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import styles from "./HorizontalScroll.module.css";

export default function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const isDown = useRef(false);

  const handleArrowScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.7;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const stopDragging = () => {
    isDown.current = false;
    setTimeout(() => setIsDragging(false), 50);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 0.5; 
    
    if (Math.abs(x - startX) > 5) {
        setIsDragging(true);
    }

    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const onClickCapture = (e: MouseEvent) => {
    if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
    }
  };

  return (
    <div className={styles.containerWrapper}>
      
      <button 
        className={`${styles.arrowButton} ${styles.leftArrow}`} 
        onClick={() => handleArrowScroll('left')}
      >
        <MdChevronLeft size={40} />
      </button>

      <div 
        className={`${styles.scrollContainer} ${isDragging ? styles.dragging : ''}`} 
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={onMouseMove}
        onClickCapture={onClickCapture}
      >
        {children}
      </div>

      <button 
        className={`${styles.arrowButton} ${styles.rightArrow}`} 
        onClick={() => handleArrowScroll('right')}
      >
        <MdChevronRight size={40} />
      </button>

    </div>
  );
}