// Импортируем 'test' и 'expect' из библиотеки Playwright
const { test, expect } = require('@playwright/test');

// Описываем наш набор тестов
test.describe('@ui Авторизация на Sauce Demo', () => {

  // Создаем тест-кейс
  test('Пользователь должен успешно войти в систему', async ({ page }) => {
    // 1. Переходим на страницу
    await page.goto('https://www.saucedemo.com/');

    // 2. Вводим логин
    // Используем селектор по id
    await page.locator('[data-test="username"]').fill('standard_user');

    // 3. Вводим пароль
    // Используем селектор по placeholder
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 4. Нажимаем кнопку входа
    // Используем селектор по data-test атрибуту
    await page.locator('[data-test="login-button"]').click();

    // 5. Проверяем, что URL изменился и содержит нужную часть
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  // Неуспешный вход
  test('Заблокированный пользователь не может войти в систему', async ({ page }) => {
    // 1. Переходим на страницу
    await page.goto('https://www.saucedemo.com/');

    // 2. Вводим логин
    // Используем селектор по id
    await page.locator('[data-test="username"]').fill('locked_out_user');

    // 3. Вводим пароль
    // Используем селектор по placeholder
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 4. Нажимаем кнопку входа
    // Используем селектор по data-test атрибуту
    await page.locator('[data-test="login-button"]').click();

    // 5. Проверяем, что появилось сообщение об ошибке с текстом
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');

    // Дополнительная проверка: пользователь остался на странице логина
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
