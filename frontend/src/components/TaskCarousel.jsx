import { useEffect, useMemo, useRef, useState } from "react";
import TaskItem from "./TaskItem";

function TaskCarousel({ tasks, onToggle, onDelete, onUpdate }) {
  const trackRef = useRef(null);

  const [paused, setPaused] = useState(false);

  const offset = useRef(0);
  const loopWidth = useRef(0);
  const resumeTimer = useRef(null);

  // Duplicate tasks so we can loop without resetting scroll visually
  const slides = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    return [...tasks, ...tasks];
  }, [tasks]);

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;
    if (!trackRef.current) return;

    let raf;
    let last = 0;
    const speed = 55;

    function measure() {
      // Half the total width = width of one full set
      const full = trackRef.current.scrollWidth;
      loopWidth.current = full / 2;
    }

    function animate(ts) {
      raf = requestAnimationFrame(animate);

      if (paused) {
        last = ts;
        return;
      }

      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;

      offset.current -= speed * dt;

      // When we've scrolled one full set, jump back
      if (loopWidth.current > 0 && -offset.current >= loopWidth.current) {
        offset.current += loopWidth.current;
      }

      trackRef.current.style.transform = `translateX(${offset.current}px)`;
    }

    measure();
    window.addEventListener("resize", measure);

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [tasks, paused]);

  function pause() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setPaused(true);
  }

  function resume() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);

    // Small delay so it doesn't instantly start again
    resumeTimer.current = setTimeout(() => {
      setPaused(false);
      resumeTimer.current = null;
    }, 600);
  }

  if (!tasks || tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <div
      className="carousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onPointerDown={pause}
      onPointerUp={resume}
      onPointerCancel={resume}
    >
      <div className="carousel-track" ref={trackRef}>
        {slides.map((t, i) => (
          <div className="carousel-slide" key={`${t.id}-${i}`}>
            <TaskItem
              task={t}
              onToggle={() => onToggle(t.id)}
              onDelete={() => onDelete(t.id)}
              onUpdate={(payload) => onUpdate(t.id, payload)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskCarousel;