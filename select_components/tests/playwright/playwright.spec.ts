import { test, expect } from "@playwright/test";

const URL = "http://localhost:3000";

test("[Select의 폭 조정]", async ({ page }) => {
  await page.goto(URL);

  // 복수의 select컴포넌트가 있을수 있으니, 임의로 첫번째 컴포넌트를 선택
  const containerElm = page.locator(".search-1");
  await page.waitForSelector('.search-1 .search:not([data-loading="true"])');

  // 부모요소의 너비 가져오기
  const selectElm = containerElm.locator(".search");
  const selectBox = await selectElm.boundingBox();
  const selectWidth = selectBox?.width;

  // 모든 li 요소의 너비 가져와서 최대값 구하기
  const liElms = containerElm.locator(".search-list li");
  const liWidths = await liElms.evaluateAll((elements) =>
    elements.map((el: any) => el.getBoundingClientRect().width)
  );
  const maxLiWidth = Math.max(...liWidths);

  // 부모요소의 너비가 모든 li 요소의 너비보다 큰지 확인
  expect(selectWidth).toBeGreaterThan(maxLiWidth);
});

test("[목록 검색 기능]", async ({ page }) => {
  await page.goto(URL);
  const containerElm = page.locator(".search-1");
  await page.waitForSelector('.search-1 .search:not([data-loading="true"])');

  const searchElm = containerElm.locator(".search");
  const searchInput = containerElm.locator(".search input");
  const liElms = containerElm.locator(".search-list li");

  await test.step("1. 옵션 목록 표시 확인", async () => {
    await searchElm.click();
    await page.waitForSelector(".search-1 .search-list li");
    const isListVisible = await liElms.first().isVisible();
    expect(isListVisible).toBeTruthy();
  });

  await test.step("2. 검색 기능 테스트", async () => {
    await searchElm.click();
    await searchInput.fill("love");
    await page.waitForTimeout(300);
    await expect(searchInput).toHaveValue("love");

    const optionCount = await liElms.count();
    expect(optionCount).toBeGreaterThan(0);

    for (let i = 0; i < optionCount; i++) {
      const optionText = await liElms.nth(i).innerText();
      expect(optionText.toLowerCase()).toContain("love");
    }
  });

  await test.step("3. 검색어 초기화 테스트 (선택된 검색어 없음)", async () => {
    // 결과값을 선택하지 않고, 벗어나면 검색어가 초기화 되는지 확인
    await page.click("body");
    await page.waitForSelector(".search-1 #search-input:empty");
    const searchTerm = await searchInput.inputValue();
    expect(searchTerm).toBe("");
  });

  await test.step("4. 검색어 초기화 테스트 (선택된 검색어 있음)", async () => {
    // 검색어를 수정하다가 벗어나면, 선택된 검색어가 유지되는지 확인
    await searchInput.click();
    await searchInput.fill("love");
    await page.waitForTimeout(200);

    await page.waitForSelector(".search-1 .search-list li", {
      state: "visible",
      timeout: 10000,
    });
    // 첫번째 옵션 선택
    const updatedLiElms = containerElm.locator(".search-list li");
    const firstSearchTerm = await updatedLiElms.first().innerText();
    await updatedLiElms.first().click();

    //  검색어 수정 중에 벗어났을때 선택된 옵션의 검색어가 유지되는지 확인
    await searchInput.click();
    await searchInput.press("Backspace");
    await page.waitForTimeout(200);
    await searchInput.press("Backspace");
    await page.click("body");

    const currentSearchTerm = await searchInput.inputValue();
    expect(currentSearchTerm).toBe(firstSearchTerm);
  });

  await test.step("5. 삭제 버튼 클릭 시 검색어 초기화 확인", async () => {
    await searchInput.click();
    await liElms.first().click();
    await searchInput.click(); // hidden인 버튼을 나타나게 하기 위해서 한번 더 클릭
    await page.waitForSelector(".search-1 .search-closeBtn");
    const closeBtn = containerElm.locator(".search-closeBtn");
    await closeBtn.click();
    const searchTerm3 = await searchInput.inputValue();
    expect(searchTerm3).toBe("");
  });
});

test("[키보드 테스트]", async ({ page }) => {
  await page.goto(URL);
  const containerElm = page.locator(".search-1");
  await page.waitForSelector('.search-1 .search:not([data-loading="true"])');

  const searchInput = containerElm.locator("#search-input"); // 검색 인풋

  // 1. 키보드 테스트
  await searchInput.click();
  await searchInput.fill("dark");
  await page.waitForTimeout(300); // 디바운스 시간 대기

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  const searchTerm = await searchInput.inputValue();
  expect(searchTerm.toLowerCase()).toContain("dark");
});

test("[마우스 테스트]", async ({ page }) => {
  await page.goto(URL);
  const containerElm = page.locator(".search-1");
  await page.waitForSelector('.search-1 .search:not([data-loading="true"])');

  const searchInput = containerElm.locator("#search-input"); // 검색 인풋

  await searchInput.click();
  await searchInput.fill("god");
  await page.waitForTimeout(300); // 디바운스 시간 대기

  const liElms = containerElm.locator(".search-list li");
  await liElms.first().click();

  const searchTerm = await searchInput.inputValue();
  expect(searchTerm.toLowerCase()).toContain("god");
});

test("[목록 표시 트리거]", async ({ page }) => {
  await page.goto(URL);
  const containerElm = page.locator(".search-1");
  await page.waitForSelector('.search-1 .search:not([data-loading="true"])');

  const searchInput = containerElm.locator("#search-input");

  // 1. 클릭시 목록 확인
  await searchInput.click();
  await page.waitForSelector(".search-1 .search-list");

  const listElm = containerElm.locator(".search-list");
  const isListVisible = await listElm.isVisible();
  expect(isListVisible).toBeTruthy();

  // 2. 키보드로 목록 확인
  await page.keyboard.press("Escape"); // 열려있는 목록 닫기
  await page.waitForSelector(".search-1 .search-list", { state: "hidden" });

  // 목록이 닫혔는지 확인
  const isListVisible2 = await listElm.isVisible();
  expect(isListVisible2).toBeFalsy();

  await page.keyboard.press("ArrowDown"); // 목록 열기
  await page.waitForSelector(".search-1 .search-list");

  // 목록이 다시 나타났는지 확인
  const isListVisible3 = await listElm.isVisible();
  expect(isListVisible3).toBeTruthy();
});

test("[Selected 강조, 키보드 순회 및 스타일 변화 테스트]", async ({ page }) => {
  await page.goto(URL);
  const containerElm = page.locator(".search-1");
  await page.waitForSelector('.search-1 .search:not([data-loading="true"])');

  const searchElm = containerElm.locator(".search");
  const liElms = containerElm.locator(".search-list li");

  const initStyle = await searchElm.evaluate(
    (el) => getComputedStyle(el).border
  );

  await test.step("1. 선택된 옵션 강조 확인", async () => {
    await searchElm.click();
    await liElms.first().click();
    await searchElm.click();
    await page.waitForSelector(
      ".search-1 .search-list li[aria-selected='true']",
      { state: "visible", timeout: 10000 }
    );
    const selectedLiElm = containerElm.locator(
      ".search-list li[aria-selected='true']"
    );
    await expect(selectedLiElm).toBeVisible();
    const focusBackgroundColor = await selectedLiElm.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(focusBackgroundColor).not.toBe(initStyle);
    await page.keyboard.press("Escape");
  });

  await test.step("2. 두 번째 옵션 선택 및 유지 확인", async () => {
    await searchElm.click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await searchElm.click();
    await page.waitForSelector(
      ".search-1 .search-list li[aria-selected='true']",
      { state: "visible", timeout: 10000 }
    );
    const selectedLiElm = containerElm.locator(
      ".search-list li[aria-selected='true']"
    );
    await expect(selectedLiElm).toBeVisible();
    const secondLiText = await liElms.nth(1).innerText();
    await page.waitForSelector(
      ".search-1 .search-list li[aria-selected='true']",
      { state: "visible", timeout: 10000 }
    );
    const selectedLiText = await containerElm
      .locator(".search-list li[aria-selected=true]")
      .innerText();
    expect(selectedLiText).toBe(secondLiText);
  });

  await test.step("3. 스타일 변화 테스트 (hover, focus)", async () => {
    await searchElm.hover();
    const hoverStyle = await searchElm.evaluate(
      (el) => getComputedStyle(el).border
    );
    expect(hoverStyle).not.toBe(initStyle);

    await searchElm.click();
    const focusStyle = await searchElm.evaluate(
      (el) => getComputedStyle(el).border
    );
    expect(focusStyle).not.toBe(hoverStyle);

    await page.click("body");
    expect(focusStyle).not.toBe(initStyle);
  });
});

test("[화면 벗어나지 않기]", async ({ page }) => {
  await page.goto(URL);
  await page.setViewportSize({ width: 1280, height: 1000 });

  const containerElm = page.locator(".search-1.search-container");
  const searchElm = containerElm.locator(".search");
  const searchList = containerElm.locator(".search-list");

  // search를 위에 위치시키는 함수
  const positionAbove = async () => {
    await containerElm.evaluate((element: HTMLElement) => {
      element.style.position = "absolute";
      element.style.top = "0px";
      element.style.bottom = "auto";
      element.style.left = "0";
    });
  };

  // search를 아래에 위치시키는 함수
  const positionBelow = async () => {
    await containerElm.evaluate((element: HTMLElement) => {
      element.style.position = "absolute";
      element.style.top = "auto";
      element.style.bottom = "0px";
      element.style.left = "0";
    });
  };

  // 1. 위에 있을 때 테스트
  await test.step("[list가 아래로 열리는 테스트]", async () => {
    await positionAbove();
    await searchElm.click();
    await page.waitForTimeout(300);

    const searchBox = await searchElm.boundingBox();
    const listBox = await searchList.boundingBox();

    expect(searchBox).not.toBeNull();
    expect(listBox).not.toBeNull();

    if (searchBox && listBox) {
      expect(listBox.y).toBeGreaterThanOrEqual(searchBox.y + searchBox.height);
    }
  });

  // 2. 아래에 있을 때 테스트
  await test.step("[list가 위로 열리는 테스트]", async () => {
    await page.keyboard.press("Escape"); // 열려있는 목록 닫기
    await positionBelow();
    await searchElm.click();
    await page.waitForTimeout(300);

    const searchBox = await searchElm.boundingBox();
    const listBox = await searchList.boundingBox();

    expect(searchBox).not.toBeNull();
    expect(listBox).not.toBeNull();

    if (searchBox && listBox) {
      expect(listBox.y + listBox.height).toBeGreaterThanOrEqual(searchBox.y);
    }
  });
});
