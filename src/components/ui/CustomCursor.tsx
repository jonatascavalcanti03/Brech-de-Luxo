"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring   = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX  = 0;
    let ringY  = 0;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top  = `${mouseY}px`;
    };

    // Ring follows with lag (smooth lerp)
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;
      raf = requestAnimationFrame(animate);
    };

    // Expand on interactive elements
    const onMouseEnter = () => {
      cursor.classList.add("cursor-hover");
      ring.classList.add("cursor-hover");
    };
    const onMouseLeave = () => {
      cursor.classList.remove("cursor-hover");
      ring.classList.remove("cursor-hover");
    };

    const addListeners = () => {
      const interactives = document.querySelectorAll(
        "a, button, [role='button'], input, select, textarea, label, [data-cursor='pointer']"
      );
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnter);
        el.addEventListener("mouseleave", onMouseLeave);
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    addListeners();
    raf = requestAnimationFrame(animate);

    // Re-attach on DOM changes
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} id="custom-cursor" aria-hidden="true" />
      <div ref={ringRef}   id="custom-cursor-ring" aria-hidden="true" />
    </>
  );
}
