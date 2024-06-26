import { test, expect } from "@playwright/test";

test("Browse products and checkout", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/v1/");
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.getByRole("button", { name: "LOGIN" }).click();
  await page
    .getByRole("link", { name: "Test.allTheThings() T-Shirt (" })
    .click();
  await page.getByRole("button", { name: "ADD TO CART" }).click();
  await page.getByRole("button", { name: "<- Back" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^\$15\.99ADD TO CART$/ })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "REMOVE" }).nth(1).click();
  await page.locator("#shopping_cart_container").getByRole("link").click();

  const itemNames = await page.$$eval(".inventory_item_name", (items) =>
    items.map((item) => item.textContent?.trim())
  );

  expect(itemNames).toContain("Sauce Labs Bolt T-Shirt");
  expect(itemNames.length).toBe(1);

  await page.getByRole("link", { name: "CHECKOUT" }).click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill("first name");
  await page.locator('[data-test="firstName"]').press("Tab");
  await page.locator('[data-test="lastName"]').fill("last name");
  await page.locator('[data-test="lastName"]').press("Tab");
  await page.locator('[data-test="postalCode"]').fill("800100");
  await page.getByRole("button", { name: "CONTINUE" }).click();
  await page.getByRole("link", { name: "FINISH" }).click();

  const thankYouMessage = await page.locator(".complete-header").innerText();
  expect(thankYouMessage).toContain("THANK YOU FOR YOUR ORDER");
});
