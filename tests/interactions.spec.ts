import { expect, test, type Page } from '@playwright/test';

// Entrances run once per session; mark them seen so tests act on settled screens.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      ['V9Home', 'V9Actions', 'V9Recovery', 'V9Learn', 'V9Analysis', 'V9Verify', 'V9ArticleMin'].forEach((n) => sessionStorage.setItem('cc9-in-' + n, '1'));
    } catch {}
  });
});

async function holdFor(page: Page, selector: string, ms: number) {
  // the sheet rises on a spring; measure the button once it has settled
  await page.waitForTimeout(900);
  const box = (await page.locator(selector).boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
}

async function swipe(page: Page, row: ReturnType<Page['locator']>, dx: number) {
  const box = (await row.boundingBox())!;
  const y = box.y + box.height / 2;
  const x = box.x + box.width / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(x + (dx * i) / 10, y, { steps: 2 });
  await page.mouse.up();
}

test('arrow key on the chart changes the month and aria-valuetext', async ({ page }) => {
  await page.goto('/analysis');
  const slider = page.getByRole('slider', { name: 'Month' });
  await expect(slider).toHaveAttribute('aria-valuetext', 'February 2026, 624, minus 16 versus January');
  await slider.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(slider).toHaveAttribute('aria-valuenow', '4');
  await expect(slider).toHaveAttribute('aria-valuetext', 'January 2026, 640, minus 31, high utilisation');
  await expect(page.locator('.fig-l').first()).toHaveText('640');
  await page.keyboard.press('Home');
  await expect(slider).toHaveAttribute('aria-valuetext', 'September 2025, 708, no change');
  await page.keyboard.press('End');
  await expect(slider).toHaveAttribute('aria-valuenow', '5');
});

test('tapping a stack strip brings that phase forward', async ({ page }) => {
  await page.goto('/recovery');
  const page2 = page.locator('.pg').nth(1);
  await expect(page2).toHaveAttribute('data-p', '1');
  await page.getByRole('button', { name: 'Phase 2, Build a clean record, not shown' }).first().click();
  await expect(page2).toHaveAttribute('data-p', '0');
  await expect(page.locator('.sdots button').nth(1)).toHaveAttribute('aria-current', 'true');
});

test('dragging the top phase page up sends it to the back', async ({ page }) => {
  await page.goto('/recovery');
  const top = page.locator('.pg[data-p="0"]');
  const box = (await top.boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + 140;
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(x, y - i * 12, { steps: 2 });
  await page.mouse.up();
  await expect(page.locator('.pg').nth(1)).toHaveAttribute('data-p', '0');
});

test('holding the Pay button 600 ms reaches the receipt', async ({ page }) => {
  await page.goto('/actions?sheet=pay');
  await expect(page.getByRole('dialog', { name: 'Pay HDFC Credit Card' })).toBeVisible();
  await holdFor(page, '.hold', 750);
  await expect(page.getByText('Sending ₹15,400')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Payment sent' })).toBeVisible({ timeout: 4000 });
  await expect(page.getByLabel('Payment receipt')).toBeVisible();
  await expect(page.getByLabel('₹0')).toBeVisible();
});

test('releasing the Pay button at 250 ms shows "Released early"', async ({ page }) => {
  await page.goto('/actions?sheet=pay');
  await expect(page.locator('.hold')).toBeVisible();
  await holdFor(page, '.hold', 250);
  await expect(page.locator('.hold')).toHaveText('Released early');
  await expect(page.locator('.hold')).toHaveText('Hold to pay ₹15,400', { timeout: 3000 });
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
});

test('tapping the Pay button opens the confirm dialog', async ({ page }) => {
  await page.goto('/actions?sheet=pay');
  await page.locator('.hold').click();
  const dlg = page.getByRole('alertdialog', { name: 'Pay ₹15,400 to HDFC •• 4412?' });
  await expect(dlg).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dlg).toHaveCount(0);
});

test('swiping a row right opens its task', async ({ page }) => {
  await page.goto('/actions');
  await swipe(page, page.locator('.swr .lr').nth(1), 140);
  await expect(page.getByRole('dialog', { name: 'Set up auto-pay' })).toBeVisible();
});

test('swiping a row left snoozes it', async ({ page }) => {
  await page.goto('/actions');
  await swipe(page, page.locator('.swr .lr').nth(2), -140);
  await expect(page.getByRole('status').filter({ hasText: 'remind you at 6 pm' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('completing a task moves it to Completed and the toast undoes it', async ({ page }) => {
  await page.goto('/actions');
  await page.locator('.swr .lr').nth(1).click();
  await page.locator('.hold').click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Set up auto-pay' }).click();
  const toast = page.locator('.toast').filter({ hasText: 'Auto-pay request sent' });
  await expect(toast).toBeVisible();
  const completed = page.getByRole('region', { name: 'Completed' });
  await expect(completed.getByText('Set up auto-pay for SBI loan')).toBeVisible({ timeout: 3000 });
  await expect(page.getByRole('region', { name: 'To do' }).getByText('Set up auto-pay', { exact: true })).toHaveCount(0);
  await toast.getByRole('button', { name: 'Undo' }).click();
  await expect(completed.getByText('Set up auto-pay for SBI loan')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'To do' }).getByText('Set up auto-pay', { exact: true })).toBeVisible();
});

test('typing 6 OTP digits auto-submits', async ({ page }) => {
  await page.goto('/verify');
  await page.getByRole('button', { name: 'Send code' }).click();
  const otp = page.getByLabel('6-digit code');
  await expect(otp).toBeVisible();
  await expect(page.getByRole('button', { name: 'Verify and fetch report' })).toHaveAttribute('aria-disabled', 'true');
  await expect(page.getByText('Enter all 6 digits')).toBeVisible();
  await otp.pressSequentially('482193', { delay: 30 });
  await expect(page.getByRole('heading', { name: 'Getting your report' })).toBeVisible({ timeout: 3000 });
  await expect(page.getByRole('heading', { name: 'Your plan is ready' })).toBeVisible({ timeout: 8000 });
});

test('the Learn factor tap updates its live note', async ({ page }) => {
  await page.goto('/learn');
  const note = page.locator('.z941556');
  await expect(note).toHaveText('Tap a factor to see what it means');
  const btn = page.getByRole('button', { name: 'Utilisation 25%' });
  await btn.click();
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await expect(note).toHaveText('How much of your limit you use. Keep it under 30%');
  await expect(page.locator('.fbar')).toHaveAttribute('data-sel', '1');
});

test('the ArticleMin slider updates years and interest', async ({ page }) => {
  await page.goto('/learn/minimum-payments');
  const years = page.locator('.fig-xl');
  await expect(years).toContainText('~15');
  await expect(page.getByText('₹1.36 lakh').first()).toBeVisible();
  await page.getByLabel('Extra each month').fill('500');
  await expect(years).toContainText('~6.3');
  await expect(page.locator('.z7604c4 .mono')).toHaveText('₹86,000');
  await expect(page.getByLabel('Extra each month')).toHaveAttribute('aria-valuetext', '+₹500 extra a month');
});

test('week day tap updates the live note', async ({ page }) => {
  await page.goto('/home');
  await page.getByRole('button', { name: /^Mon 2 Feb/ }).click();
  await expect(page.locator('.z55ea80')).toHaveText('Mon 2 Feb · On time · nothing due');
});

test('paying from Home marks the Today card paid', async ({ page }) => {
  await page.goto('/home');
  await page.getByRole('link', { name: 'Pay ₹15,400' }).click();
  await expect(page.getByRole('dialog', { name: 'Pay HDFC Credit Card' })).toBeVisible();
  await page.locator('.hold').click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Pay ₹15,400' }).click();
  await expect(page.getByRole('heading', { name: 'Payment sent' })).toBeVisible({ timeout: 4000 });
  await page.getByRole('button', { name: 'Back to Home' }).click();
  await expect(page.getByText('HDFC minimum paid')).toBeVisible();
});
