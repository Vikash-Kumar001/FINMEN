import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);
  const [start, setStart] = useState(false);

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "medium") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else if (speed === "slow") {
        containerRef.current.style.setProperty("--animation-duration", "150s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  useEffect(() => {
    function addAnimation() {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });

        getDirection();
        getSpeed();
        setStart(true);
      }
    }

    addAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerClass = `scroller relative z-20 w-full mx-auto overflow-hidden ${className || ""}`;
  const listClass = `flex min-w-full shrink-0 gap-1 sm:gap-2 md:gap-3 py-2 sm:py-3 md:py-4 w-max flex-nowrap ${start ? "animate-scroll" : ""} ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`;

  return (
    <div
      ref={containerRef}
      className={containerClass}
    >
      <ul
        ref={scrollerRef}
        className={listClass}
      >
        {items.map((item, idx) => (
          <li
            className="w-[170px] sm:w-[200px] md:w-[240px] lg:w-[280px] xl:w-[320px] max-w-full relative rounded-2xl flex-shrink-0 px-1 py-2"
            key={idx}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

