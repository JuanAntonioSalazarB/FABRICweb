"use client";

import React, { useState, useEffect, useRef } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  minHeight?: string;
  className?: string;
  rootMargin?: string;
}

export default function LazySection({
  children,
  minHeight = "200px",
  className = "",
  rootMargin = "300px",
}: LazySectionProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);



  return (
    <div
      ref={containerRef}
      className={className}
      style={!isIntersecting ? { minHeight } : undefined}
    >
      {isIntersecting ? children : null}
    </div>
  );
}
