import { test, expect } from '@playwright/test';

let createdBookingId;
let authToken;

// test.describe.serial для последовательного выполнения - так можно делать?
test.describe.serial('API-тесты для Restful-booker', () => {

  const baseURL = 'https://restful-booker.herokuapp.com';

  // Данные для создания нового бронирования
  const postData = {
    firstname: "Diana",
    lastname: "Prokhorova",
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
        checkin: "2026-01-01",
        checkout: "2026-01-15"
    },
    additionalneeds: "Breakfast"
  };

  test('Получение токена авторизации', async ({ request }) => {
    // Получение токена для авторизации
    const response = await request.post(`${baseURL}/auth`, {
        data: {
            username: "admin",
            password: "password123"
        }
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Сохраняем токен для следующих тестов (PUT, DELETE)
    authToken = responseBody.token;
    expect(authToken).toBeDefined();
    console.log(`Получен токен авторизации.`);
  });

  // Create - POST
  test('Создание бронирования', async ({ request }) => {
    // Отправляем POST-запрос
    const response = await request.post(`${baseURL}/booking`, {
      data: postData,
    });

    // Проверка 1: Статус-код ответа
    console.log(`Статус-код: ${response.status()}`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Проверка 2: В ответе (response body) содержится bookingid
    expect(responseBody).toHaveProperty('bookingid');

    // // Сохраняем bookingid для следующих тестов
    createdBookingId = responseBody.bookingid;

    // Проверка 3: В ответе возвращаются те же данные, которые вы отправляли
    const booking = responseBody.booking;
    expect(booking).toMatchObject(postData)
    console.log(`Создано бронирование с ID: ${createdBookingId}`);
  });

  // Read - GET
  test('Получение информации о бронировании', async ({ request }) => {
    // Убедимся, что ID был получен в первом тесте
    expect(createdBookingId).toBeDefined();

    // Отправляем GET-запрос
    const response = await request.get(`${baseURL}/booking/${createdBookingId}`);

    // Проверка 1: Статус-код ответа
    console.log(`Статус-код: ${response.status()}`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Проверка 2: Данные в ответе соответствуют данным, созданным в первом тесте
    expect(responseBody).toMatchObject(postData)
    console.log(`Успешно получены данные о бронировании с ID: ${createdBookingId}`);
  });

  // Update - PUT
  test('Обновление бронирования', async ({ request }) => {
    // Убедимся, что ID и токен были получены
    expect(createdBookingId).toBeDefined();
    expect(authToken).toBeDefined();

    const updatedData = { 
        firstname: "Diana",
        lastname: "Prokhorova",
        totalprice: 999, // Обновленные данные
        depositpaid: false,
        bookingdates: {
            checkin: "2027-02-01",
            checkout: "2027-02-10"
        },
        additionalneeds: "Dinner"
    };

    // Отправляем PUT-запрос
    const response = await request.put(`${baseURL}/booking/${createdBookingId}`, {
      data: updatedData,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${authToken}`
      }
    });

    // Проверка 1: Статус-код ответа
    console.log(`Статус-код: ${response.status()}`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Проверка 2: В ответе содержатся обновленные данные
    expect(responseBody).toMatchObject(updatedData)
    console.log(`Бронирование ID: ${createdBookingId} успешно обновлено.`);
  });

  // Delete - DELETE
  test('Удаление бронирования', async ({ request }) => {
    // Убедимся, что ID и токен были получены
    expect(createdBookingId).toBeDefined();
    expect(authToken).toBeDefined();

    // Отправляем DELETE-запрос
    const response = await request.delete(`${baseURL}/booking/${createdBookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${authToken}`
      }
    });

    // Проверка 1: Статус-код ответа
    console.log(`Статус-код: ${response.status()}`);
    expect(response.status()).toBe(201);

    // Проверка 2: Попытка получить ресурс с помощью GET-запроса на тот же ID
    // Отправляем GET-запрос
    const getResponse = await request.get(`${baseURL}/booking/${createdBookingId}`);

    // Проверка статус-код ответа
    console.log(`Статус-код: ${getResponse.status()}`);
    expect(getResponse.status()).toBe(404);

    console.log(`Бронирование ID: ${createdBookingId} успешно удалено.`);
  });
});
