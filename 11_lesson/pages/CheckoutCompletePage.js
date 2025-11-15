import { expect } from '@playwright/test';

export class CheckoutCompletePage {
    constructor(page) {
        this.page = page;

        this.completeHeaderTitle = page.locator('[data-test="complete-header"]');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
    }

    async getCompletionMessage() {
        await expect(this.completeHeaderTitle).toBeVisible();
        return await this.completeHeaderTitle.textContent();
    }

}