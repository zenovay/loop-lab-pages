import { describe, expect, it } from 'vitest'
import { buttonLabel, impressionKey } from './footer-widget'

describe('footer widget', () => {
  it('uses the page call to action', () => expect(buttonLabel({ cta: 'Get updates' })).toBe('Get updates'))
  it('falls back to Subscribe for a blank call to action', () => expect(buttonLabel({ cta: '  ' })).toBe('Subscribe'))
  it('keys an impression by page, campaign and source', () => {
    expect(
      impressionKey({ page: 'home', headline: 'h', cta: 'c', campaign: { id: 'autumn', source: 'footer' } }),
    ).toBe('home:autumn:footer')
  })
})
