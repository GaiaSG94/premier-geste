export type View = {
  el: HTMLElement
  destroy(): void
  act?(action: string, target: HTMLElement): void
  sync?(route: { page: 'guide'; u: string; i: number }): void
}

export function esc(value: string | number): string {
  return String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] as string))
}

export const callBar = '<a class="a-call" href="tel:15">Appeler le 15</a>'

export const notch = '<div class="notch" aria-hidden="true"></div>'

export function render(el: HTMLElement, markup: string): void {
  el.innerHTML = markup
  el.scrollTop = 0
}
