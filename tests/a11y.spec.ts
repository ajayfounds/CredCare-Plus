import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      ['V9Home', 'V9Actions', 'V9Analysis', 'V9Verify'].forEach((n) => sessionStorage.setItem('cc9-in-' + n, '1'));
    } catch {}
  });
});

const PAGES = [
  ['Home', '/home'],
  ['Analysis', '/analysis'],
  ['Actions', '/actions'],
  ['Pay sheet', '/actions?sheet=pay'],
  ['Verify', '/verify'],
] as const;

for (const [name, url] of PAGES) {
  test(`axe: ${name} has no violations`, async ({ page }) => {
    await page.goto(url);
    await page.waitForTimeout(1200);
    // Week-day buttons show 'M 2' but are named 'Mon 2 Feb, On time · nothing due' as spec/accessibility.md requires;
    // axe's experimental label-in-name rule is excluded for them only.
    const r = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    const weekDay = (html: string) => /class="(ok |ms )?td"|class="ok"|class="ms"|aria-pressed=/.test(html) && /Feb,/.test(html);
    const v = r.violations
      .map((x) => ({ ...x, nodes: x.id === 'label-content-name-mismatch' ? x.nodes.filter((n) => !weekDay(n.html)) : x.nodes }))
      .filter((x) => x.nodes.length)
      .map((x) => `${x.id}: ${x.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
    expect(v, v.join('\n')).toEqual([]);
  });
}

test('renders with prefers-reduced-motion: reduce', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto('/home');
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
  // entrance animations collapse to a fade; nothing is left mid-flight
  const moving = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && (a as CSSAnimation).animationName && !/fade|spin|pulse|print|tick/.test((a as CSSAnimation).animationName)).map((a) => (a as CSSAnimation).animationName));
  expect(moving).toEqual([]);
  await page.goto('/recovery');
  const t = await page.locator('.pg[data-p="1"]').evaluate((el) => getComputedStyle(el).transform);
  expect(t).not.toContain('matrix3d');
  await ctx.close();
});

test('renders with prefers-reduced-transparency: reduce', async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
  await page.goto('/actions?sheet=pay');
  const card = page.locator('.sheet .cc.tilt');
  await expect(card).toBeVisible();
  const specular = await card.evaluate((el) => getComputedStyle(el, '::after').backgroundImage);
  expect(specular).toBe('none');
  const fill = await page.evaluate(() => getComputedStyle(document.querySelector('.r')!).getPropertyValue('--on-ink-hold').trim());
  expect(fill.toLowerCase()).toBe('#0f1f70');
});
