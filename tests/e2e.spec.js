import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage.js';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage.js';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage.js';

test("Успешный логин и проверка страницы товаров", { tag: '@ui' }, async ({page}) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    // 1. Открыть страницу логина
    console.log('Шаг 1: Открыть страницу логина.');
    await loginPage.open();

    // 2. Залогиниться, используя валидные данные (standard_user, secret_sauce)
    console.log('Шаг 2: Залогиниться.');
    await loginPage.login('standard_user', 'secret_sauce');

    // 3. Убедиться, что открылась страница с товарами
    console.log('Шаг 3: Открылась страница с товарами.');
    const pageTitle = await inventoryPage.getPageTitle();
    await expect(pageTitle).toBe('Products');

    // 4. Добавить в корзину самый дорогой товар
    console.log('Шаг 4: Добавляем самый дорогой товар.');
    await inventoryPage.sortProducts('hilo');

    const firstItemNameLocator = inventoryPage.itemNames.first(); 
    const addedItemName = await firstItemNameLocator.textContent();

    await inventoryPage.addToCartButtons.first().click();

    // 5. Перейти в корзину
    console.log('Шаг 5: Переходим в корзину.');
    await inventoryPage.openCart();

    // 6. Проверить, что товар в корзине
    console.log('Шаг 6: Проверка корзины.');
    const itemNamesInCart = await cartPage.getItemNames();
    expect(itemNamesInCart).toContain(addedItemName);

    // 7. Начать оформление заказа
    console.log('Шаг 7: Оформление заказа.');
    await cartPage.goToCheckout();

    // 8 и 9. Заполнить информацию о пользователе
    console.log('Шаг 8-9: Заполняем информацию о пользователе.');
    await checkoutStepOnePage.fillUserInfo('Test', 'User', '12345');

    // 10. Завершить покупку
    console.log('Шаг 10: Завершаем покупку.');
    await checkoutStepTwoPage.finishCheckout();
    
    // 11. Убедиться, что заказ успешно оформлен
    console.log('Шаг 11: Заказ успешно оформлен.');
    const completionMessage = await checkoutCompletePage.getCompletionMessage();
    expect(completionMessage).toBe('Thank you for your order!');

})