/**
 * The team on the about page, as a row of cards: one per view on a phone, three on a wider screen.
 * The first card after the visible ones is marked as the "peek", which the stylesheet fades in.
 */

const visibleCount = (width: number): number => (width >= 600 ? 3 : 1)

export const markPeek = (slides: readonly HTMLElement[], width: number): void => {
  const peek = slides[visibleCount(width)]
  peek.dataset.peek = 'true'
}

export const mountTeamCarousel = (root: HTMLElement): void => {
  const slides = Array.from(root.querySelectorAll<HTMLElement>('.team-card'))
  root.style.setProperty('--per-view', String(visibleCount(window.innerWidth)))
  markPeek(slides, window.innerWidth)
}
