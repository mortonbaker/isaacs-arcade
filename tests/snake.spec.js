const { test, expect } = require('@playwright/test');
const path = require('path');

const SNAKE_PATH = path.join(__dirname, '..', 'snake.html');
const SPACE_PATH = path.join(__dirname, '..', 'space-invaders.html');

test.describe('Snake Battle Royale', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`file://${SNAKE_PATH}`);
        await page.waitForTimeout(300);
    });

    test('page loads without errors', async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await page.waitForTimeout(500);
        expect(errors).toHaveLength(0);
    });

    test('canvas is visible', async ({ page }) => {
        const canvas = page.locator('#gameCanvas');
        await expect(canvas).toBeVisible();
    });

    test('score displays correctly', async ({ page }) => {
        const score = page.locator('#score');
        const scoreText = await score.textContent();
        expect(parseInt(scoreText)).toBeGreaterThanOrEqual(0);
    });

    test('arrow key controls work without errors', async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));

        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(200);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(200);
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(200);
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(200);

        expect(errors).toHaveLength(0);
    });

    test('restart button is hidden initially', async ({ page }) => {
        const overlay = page.locator('#gameOverlay');
        const display = await overlay.evaluate(el => window.getComputedStyle(el).display);
        expect(display).toBe('none');
    });

    test('high score persists across reloads', async ({ page }) => {
        await page.evaluate(() => {
            localStorage.setItem('snakeHighScore', '50');
        });

        await page.reload();
        await page.waitForTimeout(200);

        const highScore = page.locator('#highScore');
        await expect(highScore).toHaveText('50');
    });
});

test.describe('Space Invaders', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`file://${SPACE_PATH}`);
    });

    test('page loads without errors', async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await page.waitForTimeout(500);
        expect(errors).toHaveLength(0);
    });

    test('canvas is visible', async ({ page }) => {
        const canvas = page.locator('#gameCanvas');
        await expect(canvas).toBeVisible();
    });

    test('score displays correctly', async ({ page }) => {
        const score = page.locator('#score');
        await expect(score).toHaveText('0');
    });

    test('lives display correctly', async ({ page }) => {
        const lives = page.locator('#lives');
        await expect(lives).toHaveText('3');
    });

    test('space key shoots without errors', async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));

        await page.keyboard.press('Space');
        await page.waitForTimeout(200);
        await page.keyboard.press('Space');
        await page.waitForTimeout(200);
        await page.keyboard.press('Space');
        await page.waitForTimeout(200);

        expect(errors).toHaveLength(0);
    });

    test('arrow key controls work without errors', async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));

        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(200);
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(200);
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(200);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(200);

        expect(errors).toHaveLength(0);
    });

    test('restart button is hidden initially', async ({ page }) => {
        const overlay = page.locator('#gameOverlay');
        const display = await overlay.evaluate(el => window.getComputedStyle(el).display);
        expect(display).toBe('none');
    });

    test('high score persists across reloads', async ({ page }) => {
        await page.evaluate(() => {
            localStorage.setItem('spaceInvadersHighScore', '100');
        });

        await page.reload();
        await page.waitForTimeout(200);

        const highScore = page.locator('#highScore');
        await expect(highScore).toHaveText('100');
    });
});
