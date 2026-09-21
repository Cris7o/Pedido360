const iconBase = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export function IconSearch(props) {
  return (
    <svg {...iconBase} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function IconClock(props) {
  return (
    <svg {...iconBase} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function IconStar(props) {
  return (
    <svg {...iconBase} fill="currentColor" stroke="none" {...props}>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z" />
    </svg>
  )
}

export function IconBag(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M6 8h12l-1 12H7z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  )
}

export function IconPlus(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconMinus(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M5 12h14" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

export function IconFlame(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-1.5.6-2.8 1.5-4 .3 1 1 1.7 1.8 2 .1-2.6.6-5 1.7-7z" />
    </svg>
  )
}

export function IconTruck(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M3 7h10v9H3zM13 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
    </svg>
  )
}

export function IconUsers(props) {
  return (
    <svg {...iconBase} {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.2a3.2 3.2 0 0 1 0 6M17 13.6a5.5 5.5 0 0 1 3.5 5.4" />
    </svg>
  )
}

export function IconReceipt(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M6 3h12v18l-3-1.6-3 1.6-3-1.6L6 21z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  )
}

export function IconBan(props) {
  return (
    <svg {...iconBase} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
