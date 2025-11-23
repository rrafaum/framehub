"use client";

import { useRef, useState, MouseEvent } from "react";
import styles from "./HorizontalScroll.module.css";

export default function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 0.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      className={`${styles.scrollContainer} ${isDragging ? styles.dragging : ''}`}
      ref={scrollRef}
      onMouseDown={onMouseDown}
      onMouseLeave={stopDragging} 
      onMouseUp={stopDragging}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
}