import { useRef, useState } from 'react';

interface VirtualJoystickProps {
  label: string;
  onChange: (x: number, y: number) => void;
}

/**
 * Touch/pen movement stick (explore mode on coarse pointers). x → strafe, y → forward (up = +1).
 * Pointer capture keeps the drag on the stick even when the finger leaves it.
 */
export function VirtualJoystick({ label, onChange }: VirtualJoystickProps) {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState<[number, number]>([0, 0]);
  const active = useRef<number | null>(null);
  const R = 44;

  const update = (clientX: number, clientY: number) => {
    const el = base.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let dx = clientX - (r.left + r.width / 2);
    let dy = clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > R) {
      dx = (dx / len) * R;
      dy = (dy / len) * R;
    }
    setKnob([dx, dy]);
    onChange(dx / R, -dy / R);
  };
  const end = () => {
    active.current = null;
    setKnob([0, 0]);
    onChange(0, 0);
  };

  return (
    <div
      ref={base}
      role="application"
      aria-label={label}
      data-explorer3d="joystick"
      className="pointer-events-auto relative h-32 w-32 touch-none select-none rounded-full border-2 border-white/40 bg-ink-900/60"
      onPointerDown={(e) => {
        active.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (active.current === e.pointerId) update(e.clientX, e.clientY);
      }}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={end}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow"
        style={{ transform: `translate(calc(-50% + ${knob[0]}px), calc(-50% + ${knob[1]}px))` }}
      />
    </div>
  );
}
