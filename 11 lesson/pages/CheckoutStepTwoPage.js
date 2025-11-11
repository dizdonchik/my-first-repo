import { expect } from '@playwright/test';

export class CheckoutStepTwoPage {
    constructor(page) {
        this.page = page;

        this.summaryInfo = page.locator('[data-test="checkout-summary-container"]');
        this.totalPrice = page.locator('[data-test="total-label"]');

        this.finishButton = page.locator('[data-test="finish"]');
    }

    async finishCheckout() {
        await this.finishButton.click();
        await expect(this.page).toHaveURL(/.*checkout-complete.html/);
    }
    
}