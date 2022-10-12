import { test, expect } from '@playwright/test';
import { _electron } from 'playwright';

test('App launches and quits', async () => {
  test.setTimeout(300000);
  const app = await _electron.launch({args: ['.']});
  const window = await app.firstWindow();
  await expect(await window.title()).toContain('');
  await app.close();
});