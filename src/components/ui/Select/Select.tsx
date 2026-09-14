"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import styles from "./Select.module.css";

type Option = {
  value: string;
  label: string;
  selectedLabel?: string;
};

type SelectProps = {
  label: string;
  value: string;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function Select({ label, value, options, placeholder, disabled, onChange }: SelectProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const items = [{ value: "", label: placeholder }, ...options];
  const selected = items.find((option) => option.value === value);

  useEffect(() => {
    if (!open) {
      return;
    }

    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", outside);

    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (open) {
      root.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
    }
  }, [active, open]);

  function choose(index: number) {
    onChange(items[index].value);
    setOpen(false);
    trigger.current?.focus();
  }

  function show() {
    setActive(
      Math.max(
        0,
        items.findIndex((option) => option.value === value),
      ),
    );
    setOpen(true);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setOpen(false);

      return;
    }

    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();

      if (!open) {
        show();

        return;
      }

      setActive((index) =>
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? items.length - 1
            : Math.max(0, Math.min(items.length - 1, index + (event.key === "ArrowDown" ? 1 : -1))),
      );
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      choose(active);
    } else if (event.key.length === 1 && event.key !== " ") {
      const index = items.findIndex((option) =>
        option.label.toLowerCase().startsWith(event.key.toLowerCase()),
      );

      if (index >= 0) {
        event.preventDefault();
        setOpen(true);
        setActive(index);
      }
    }
  }

  return (
    <div
      ref={root}
      className={styles.root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <span id={id + "-label"} className={styles.label}>
        {label}
      </span>

      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-labelledby={id + "-label"}
        aria-controls={id + "-list"}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={open ? id + "-" + active : undefined}
        disabled={disabled}
        className={styles.trigger}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={handleKeyDown}
      >
        {selected?.selectedLabel ?? selected?.label ?? placeholder}
        <span className={styles.arrow} data-open={open} />
      </button>

      {open && (
        <ul
          id={id + "-list"}
          className={styles.list}
          role="listbox"
          aria-labelledby={id + "-label"}
        >
          {items.map((option, index) => (
            <li
              id={id + "-" + index}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              data-active={index === active}
              onPointerMove={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
