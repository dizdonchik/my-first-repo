import { expect } from '@playwright/test';

export class InventoryPage {
    constructor(page) {
        this.page = page;

        this.pageTitle = page.locator('[data-test="title"]');

        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.shoppingCartIcon = page.locator('[data-test="shopping-cart-link"]');
        this.listOfProducts = page.locator('[data-test="inventory-list"]');
        this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
    }

    async sortProducts(optionValue) {
        await this.sortDropdown.selectOption(optionValue);
    }

    async addItemToCart(itemName) {
        const itemSlug = itemName.toLowerCase().replace(/ /g, '-');
        const specificButtonLocator = this.page.locator(`[data-test="add-to-cart-${itemSlug}"]`);
        await expect(specificButtonLocator).toBeVisible();
        await specificButtonLocator.click();
    }

    async openCart() {
        await this.shoppingCartIcon.click();
        await expect(this.page).toHaveURL(/.*cart.html/);
    }

    async getPageTitle() {
        await expect(this.pageTitle).toBeVisible(); 
        return this.pageTitle.textContent();
    }
}