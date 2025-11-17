import { expect } from '@playwright/test';

export class CartPage {
    constructor(page) {
        this.page = page;
        this.url = "https://www.saucedemo.com/cart.html";

        this.cartItems = page.locator('[data-test="inventory-item"]');
        this.itemName = page.locator('[data-test="inventory-item-name"]');

        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    }

    /* Переходит на первый шаг оформления заказа. */
    async goToCheckout() {
        await this.checkoutButton.click();
        await expect(this.page).toHaveURL(/.*checkout-step-one.html/);
    }

    /* Получить названия товаров */
    async getItemNames() {
        return await this.itemName.allTextContents();
    }

    /* Продолжить покупки */
    async continueShopping() {
        await this.continueShoppingButton.click();
        await expect(this.page).toHaveURL(/.*inventory.html/);
    }

    /* Удаление товара */
    async removeItem(itemName) {
        const itemSlug = itemName.toLowerCase().replace(/ /g, '-');
        const removeButtonLocator = this.page.locator(`[data-test="remove-${itemSlug}"]`);
        
        await expect(removeButtonLocator).toBeVisible();
        await removeButtonLocator.click();
    }
}