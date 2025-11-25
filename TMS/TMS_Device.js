// 分頁相關變數
let currentPage = 1;
let pageSize = 10;
let totalRecords = 0;
let allData = []; // 儲存所有資料
let importData = [];

// 初始化分頁
function initializePagination() {
  const tbody = document.getElementById("deviceTableBody");
  const rows = tbody.querySelectorAll("tr");

  // 將現有資料儲存到 allData
  allData = Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      providerId: cells[1]?.textContent || "",
      providerName: cells[2]?.textContent || "",
      rwId: cells[3]?.textContent || "",
      samId: cells[4]?.textContent || "",
    };
  });

  totalRecords = allData.length;
  updateTable();
  updatePaginationInfo();
}

// 更新表格顯示
function updateTable() {
  const tbody = document.getElementById("deviceTableBody");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalRecords);

  for (let i = start; i < end; i++) {
    const data = allData[i];
    const row = tbody.insertRow();
    row.innerHTML = `
      <td><input type="checkbox" class="row-checkbox" /></td>
      <td>${data.providerId}</td>
      <td>${data.providerName}</td>
      <td>${data.rwId}</td>
      <td>${data.samId}</td>
      <td>
        <button class="btn-delete-single" data-index="${i}" title="刪除此筆資料">✕</button>
      </td>
    `;
  }

  // 綁定單筆刪除事件
  bindSingleDeleteEvents();

  // 重新檢查刪除按鈕狀態
  updateDeleteButtonVisibility();
}

// 綁定單筆刪除按鈕事件
function bindSingleDeleteEvents() {
  document.querySelectorAll(".btn-delete-single").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const index = parseInt(this.dataset.index);

      if (confirm("確定要刪除這筆資料嗎？")) {
        allData.splice(index, 1);
        totalRecords = allData.length;

        const start = (currentPage - 1) * pageSize;
        if (start >= totalRecords && currentPage > 1) {
          currentPage--;
        }

        updateTable();
        updatePaginationInfo();
        document.getElementById("checkAll").checked = false;

        alert("刪除成功");
      }
    });
  });
}

// 更新刪除按鈕顯示狀態
function updateDeleteButtonVisibility() {
  const checkedBoxes = document.querySelectorAll(".row-checkbox:checked");
  const deleteBtn = document.getElementById("btnDelete");
  const deleteCount = document.getElementById("deleteCount");

  if (deleteBtn) {
    if (checkedBoxes.length > 0) {
      deleteBtn.style.display = "inline-block";
      if (deleteCount) {
        deleteCount.textContent = checkedBoxes.length;
      }
    } else {
      deleteBtn.style.display = "none";
    }
  }
}

// 更新分頁資訊
function updatePaginationInfo() {
  const start = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalRecords);

  document.querySelector(".pagination-info").innerHTML = `
    每頁
    <select class="page-size">
      <option value="10" ${pageSize === 10 ? "selected" : ""}>10</option>
      <option value="25" ${pageSize === 25 ? "selected" : ""}>25</option>
      <option value="50" ${pageSize === 50 ? "selected" : ""}>50</option>
      <option value="100" ${pageSize === 100 ? "selected" : ""}>100</option>
    </select>
    筆　　顯示第 ${start} ~ ${end} 筆，共 ${totalRecords} 筆
  `;

  // 重新綁定每頁筆數選擇事件
  document.querySelector(".page-size").addEventListener("change", function () {
    pageSize = parseInt(this.value);
    currentPage = 1;
    updateTable();
    updatePaginationInfo();
  });

  // 更新按鈕狀態
  const totalPages = Math.ceil(totalRecords / pageSize);
  const buttons = document.querySelectorAll(".pagination-btn");
  buttons[0].disabled = currentPage === 1;
  buttons[1].disabled = currentPage === 1;
  buttons[2].disabled = currentPage === totalPages || totalPages === 0;
  buttons[3].disabled = currentPage === totalPages || totalPages === 0;
}

// 分頁按鈕事件
function setupPaginationButtons() {
  const buttons = document.querySelectorAll(".pagination-btn");
  const totalPages = () => Math.ceil(totalRecords / pageSize);

  // 第一頁
  buttons[0].addEventListener("click", function () {
    currentPage = 1;
    updateTable();
    updatePaginationInfo();
  });

  // 上一頁
  buttons[1].addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      updateTable();
      updatePaginationInfo();
    }
  });

  // 下一頁
  buttons[2].addEventListener("click", function () {
    if (currentPage < totalPages()) {
      currentPage++;
      updateTable();
      updatePaginationInfo();
    }
  });

  // 最後一頁
  buttons[3].addEventListener("click", function () {
    currentPage = totalPages();
    updateTable();
    updatePaginationInfo();
  });
}

// 顯示篩選後的資料
function displayFilteredData(data) {
  const tbody = document.getElementById("deviceTableBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td colspan="6" style="text-align: center; padding: 30px; color: #999;">
        查無資料
      </td>
    `;
    return;
  }

  data.forEach((item, index) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td><input type="checkbox" class="row-checkbox" /></td>
      <td>${item.providerId}</td>
      <td>${item.providerName}</td>
      <td>${item.rwId}</td>
      <td>${item.samId}</td>
      <td>
        <button class="btn-delete-single" data-index="${index}" title="刪除此筆資料">✕</button>
      </td>
    `;
  });

  bindSingleDeleteEvents();
  updateDeleteButtonVisibility();
}

// 顯示匯入預覽
function displayImportPreview() {
  const tbody = document.getElementById("importPreviewBody");
  tbody.innerHTML = "";

  importData.forEach((data, index) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td><input type="checkbox" class="row-checkbox-import" data-index="${index}" /></td>
      <td>${data.serialNo}</td>
      <td>${data.uid}</td>
      <td>${data.providerId}</td>
      <td>${data.spId}</td>
      <td>${data.sCompId}</td>
      <td>${data.rwId}</td>
      <td>${data.samId}</td>
      <td><span class="badge-pending">待匯入</span></td>
    `;
  });

  document.getElementById(
    "previewCount"
  ).textContent = `共 ${importData.length} 筆資料`;
  document.getElementById("importPreview").style.display = "block";
}

// 更新移除按鈕顯示狀態
function updateRemoveButtonVisibility() {
  const checkedBoxes = document.querySelectorAll(
    ".row-checkbox-import:checked"
  );
  const removeBtn = document.getElementById("btnRemoveSelected");

  if (removeBtn) {
    removeBtn.style.display = checkedBoxes.length > 0 ? "inline-block" : "none";
  }
}

// 初始化自訂下拉選單功能
function initCustomSelect() {
  const searchInput = document.getElementById("providerIdSearch");
  const dropdown = document.getElementById("providerIdDropdown");
  const hiddenSelect = document.getElementById("providerId");
  const options = dropdown.querySelectorAll(".custom-select-option");

  if (!searchInput || !dropdown || !hiddenSelect) {
    console.error("找不到自訂下拉選單元素");
    return;
  }

  // 點擊輸入框顯示下拉選單
  searchInput.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.add("show");
    searchInput.classList.add("active");
    this.select(); // 選取文字以便搜尋
  });

  // 點擊輸入框外隱藏下拉選單
  document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("show");
      searchInput.classList.remove("active");

      // 如果沒有選擇，恢復預設文字
      if (!hiddenSelect.value) {
        searchInput.value = "";
        searchInput.placeholder = "請選擇或搜尋業者";
      }
    }
  });

  // 搜尋過濾功能
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    let hasVisibleOptions = false;

    // 移除之前的「無結果」提示
    const noResultsMsg = dropdown.querySelector(".no-results");
    if (noResultsMsg) {
      noResultsMsg.remove();
    }

    options.forEach((option) => {
      const text = option.getAttribute("data-text") || option.textContent;
      const matches = text.toLowerCase().includes(searchTerm);

      if (matches || option.getAttribute("data-value") === "") {
        option.classList.remove("hidden");
        if (option.getAttribute("data-value") !== "") {
          hasVisibleOptions = true;
        }
      } else {
        option.classList.add("hidden");
      }
    });

    // 如果沒有匹配結果，顯示提示訊息
    if (!hasVisibleOptions && searchTerm) {
      const noResultDiv = document.createElement("div");
      noResultDiv.className = "custom-select-option no-results";
      noResultDiv.textContent = "找不到符合的業者";
      dropdown.appendChild(noResultDiv);
    }

    // 顯示下拉選單
    dropdown.classList.add("show");
    searchInput.classList.add("active");
  });

  // 選擇選項
  options.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.stopPropagation();

      const value = this.getAttribute("data-value");
      const text = this.getAttribute("data-text") || this.textContent;

      // 更新隱藏的 select
      hiddenSelect.value = value;

      // 更新搜尋輸入框
      if (value) {
        searchInput.value = text;
      } else {
        searchInput.value = "";
        searchInput.placeholder = "請選擇或搜尋業者";
      }

      // 更新選中狀態
      options.forEach((opt) => opt.classList.remove("selected"));
      if (value) {
        this.classList.add("selected");
      }

      // 隱藏下拉選單
      dropdown.classList.remove("show");
      searchInput.classList.remove("active");

      // 移除錯誤樣式（如果有）
      removeFieldError("providerId");
      searchInput.classList.remove("field-error");
      searchInput.classList.remove("field-error-flash");

      // 觸發 change 事件
      hiddenSelect.dispatchEvent(new Event("change"));
    });
  });

  // 鍵盤導航
  let currentIndex = -1;
  const visibleOptions = () =>
    Array.from(options).filter(
      (opt) =>
        !opt.classList.contains("hidden") &&
        opt.getAttribute("data-value") !== ""
    );

  searchInput.addEventListener("keydown", function (e) {
    const visible = visibleOptions();

    if (e.key === "ArrowDown") {
      e.preventDefault();
      dropdown.classList.add("show");
      searchInput.classList.add("active");

      currentIndex = Math.min(currentIndex + 1, visible.length - 1);
      updateHighlight(visible);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = Math.max(currentIndex - 1, -1);
      updateHighlight(visible);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentIndex >= 0 && currentIndex < visible.length) {
        visible[currentIndex].click();
      }
    } else if (e.key === "Escape") {
      dropdown.classList.remove("show");
      searchInput.classList.remove("active");
      currentIndex = -1;
    }
  });

  function updateHighlight(visible) {
    options.forEach((opt) => opt.classList.remove("selected"));
    if (currentIndex >= 0 && currentIndex < visible.length) {
      visible[currentIndex].classList.add("selected");
      visible[currentIndex].scrollIntoView({ block: "nearest" });
    }
  }
}

// 初始化所有事件監聽器
function initializeEventListeners() {
  // 初始化自訂下拉選單
  initCustomSelect();

  // 頁籤切換
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));

      this.classList.add("active");
      const tabId = this.dataset.tab + "Tab";
      document.getElementById(tabId).classList.add("active");
    });
  });

  // 點擊其他地方關閉選單
  document.addEventListener("click", function (e) {
    const menu = document.getElementById("dateShortcutMenu");
    if (menu && menu.classList.contains("active")) {
      menu.classList.remove("active");
    }
  });

  // 查詢按鈕
  document.getElementById("btnQuery").addEventListener("click", function () {
    // 清除所有錯誤樣式
    clearFieldErrors();

    const providerId = document.getElementById("providerId").value;
    const rwId = document.getElementById("rwId").value.trim();
    const samId = document.getElementById("samId").value.trim();

    // 執行篩選
    let filteredData = allData.filter((item) => {
      let match = true;

      if (providerId && item.providerId !== providerId) {
        match = false;
      }
      if (rwId && !item.rwId.toLowerCase().includes(rwId.toLowerCase())) {
        match = false;
      }
      if (samId && !item.samId.toLowerCase().includes(samId.toLowerCase())) {
        match = false;
      }

      return match;
    });

    // 顯示查詢結果
    if (filteredData.length === 0) {
      alert(`查詢結果：找不到符合條件的資料`);
      displayFilteredData(filteredData);
    } else {
      alert(`查詢成功！找到 ${filteredData.length} 筆符合條件的資料`);
      displayFilteredData(filteredData);
    }
  });

  // 重置查詢表單
  document.getElementById("btnReset").addEventListener("click", function () {
    // 清除所有錯誤樣式
    clearFieldErrors();

    // 重置自訂下拉選單
    const searchInput = document.getElementById("providerIdSearch");
    const hiddenSelect = document.getElementById("providerId");
    const dropdown = document.getElementById("providerIdDropdown");
    const options = dropdown.querySelectorAll(".custom-select-option");

    if (searchInput) {
      searchInput.value = "";
      searchInput.placeholder = "請選擇或搜尋業者";
      searchInput.classList.remove("field-error", "field-error-flash");
    }
    if (hiddenSelect) {
      hiddenSelect.value = "";
    }
    if (options) {
      options.forEach((opt) => {
        opt.classList.remove("selected", "hidden");
      });
    }

    document.getElementById("rwId").value = "";
    document.getElementById("samId").value = "";

    currentPage = 1;
    updateTable();
    updatePaginationInfo();

    alert("查詢條件已重置");
  });

  // 新增按鈕 - 直接使用查詢欄位新增
  document.getElementById("btnAdd").addEventListener("click", function () {
    console.log("新增按鈕被點擊");

    // 取得欄位值
    const providerId = document.getElementById("providerId").value.trim();
    const rwId = document.getElementById("rwId").value.trim();
    const samId = document.getElementById("samId").value.trim();

    // 驗證欄位
    const errors = validateRequiredFields();

    if (errors.length > 0) {
      // 顯示錯誤欄位並閃爍
      highlightErrorFields(errors);

      // 特別處理自訂下拉選單的錯誤提示
      if (errors.includes("providerId")) {
        const searchInput = document.getElementById("providerIdSearch");
        if (searchInput) {
          searchInput.classList.add("field-error-flash");
          setTimeout(() => {
            searchInput.classList.remove("field-error-flash");
            searchInput.classList.add("field-error");
          }, 1500);
        }
      }

      // 顯示錯誤訊息
      const errorMessages = errors
        .map((field) => {
          switch (field) {
            case "providerId":
              return "• 業者代碼";
            case "rwId":
              return "• RW ID";
            case "samId":
              return "• SAM ID";
            default:
              return `• ${field}`;
          }
        })
        .join("\n");

      alert(`❌ 請填寫以下必填欄位：\n\n${errorMessages}`);

      // 聚焦到第一個錯誤欄位
      if (errors[0] === "providerId") {
        document.getElementById("providerIdSearch").focus();
      } else {
        document.getElementById(errors[0]).focus();
      }
      return;
    }

    // 驗證 RW ID 格式
    if (rwId.length < 3) {
      showFieldError("rwId", "RW ID 長度至少需要 3 個字元");
      return;
    }

    // 驗證 SAM ID 格式
    if (samId.length < 3) {
      showFieldError("samId", "SAM ID 長度至少需要 3 個字元");
      return;
    }

    // 取得業者名稱
    const providerSelect = document.getElementById("providerId");
    const providerName =
      providerSelect.options[providerSelect.selectedIndex].text;

    // 檢查是否重複
    const isDuplicate = allData.some(
      (item) => item.rwId === rwId && item.samId === samId
    );

    if (isDuplicate) {
      if (
        !confirm(
          `⚠️ 發現重複資料\n\nRW ID: ${rwId}\nSAM ID: ${samId}\n\n這組設備資料已經存在，確定要繼續新增嗎？`
        )
      ) {
        return;
      }
    }

    // 顯示確認對話框
    const confirmMsg =
      `📋 確認新增以下設備資料？\n\n` +
      `業者代碼: ${providerId}\n` +
      `業者名稱: ${providerName}\n` +
      `RW ID: ${rwId}\n` +
      `SAM ID: ${samId}`;

    if (!confirm(confirmMsg)) {
      return;
    }

    // 新增資料
    const newRecord = {
      providerId: providerId,
      providerName: providerName,
      rwId: rwId,
      samId: samId,
    };

    allData.unshift(newRecord);
    totalRecords = allData.length;
    currentPage = 1;

    updateTable();
    updatePaginationInfo();

    // 清除表單並移除錯誤樣式
    clearFieldErrors();

    // 重置自訂下拉選單
    const searchInput = document.getElementById("providerIdSearch");
    if (searchInput) {
      searchInput.value = "";
      searchInput.placeholder = "請選擇或搜尋業者";
      searchInput.classList.remove("field-error", "field-error-flash");
    }
    providerSelect.value = "";

    const dropdown = document.getElementById("providerIdDropdown");
    if (dropdown) {
      const options = dropdown.querySelectorAll(".custom-select-option");
      options.forEach((opt) => opt.classList.remove("selected"));
    }

    document.getElementById("rwId").value = "";
    document.getElementById("samId").value = "";

    alert(
      `✅ 新增成功！\n\n` +
        `業者代碼: ${newRecord.providerId}\n` +
        `業者名稱: ${newRecord.providerName}\n` +
        `RW ID: ${newRecord.rwId}\n` +
        `SAM ID: ${newRecord.samId}`
    );
  });

  // 監聽欄位變更，自動移除錯誤樣式
  document.querySelectorAll(".required-field").forEach((field) => {
    field.addEventListener("input", function () {
      if (this.value.trim()) {
        removeFieldError(this.id);
      }
    });

    field.addEventListener("change", function () {
      if (this.value.trim()) {
        removeFieldError(this.id);
      }
    });
  });

  // 驗證必填欄位
  function validateRequiredFields() {
    const errors = [];
    const fields = [
      { id: "providerId", name: "業者代碼" },
      { id: "rwId", name: "RW ID" },
      { id: "samId", name: "SAM ID" },
    ];

    fields.forEach((field) => {
      const element = document.getElementById(field.id);
      const value = element.value.trim();

      if (!value) {
        errors.push(field.id);
      }
    });

    return errors;
  }

  // 高亮顯示錯誤欄位
  function highlightErrorFields(errorFields) {
    errorFields.forEach((fieldId) => {
      const element = document.getElementById(fieldId);
      if (element) {
        // 添加閃爍動畫
        element.classList.remove("field-error-flash");
        element.classList.add("field-error-flash");

        // 動畫結束後保持紅色外框
        setTimeout(() => {
          element.classList.remove("field-error-flash");
          element.classList.add("field-error");
        }, 1500);
      }
    });
  }

  // 顯示單個欄位錯誤
  function showFieldError(fieldId, message) {
    const element = document.getElementById(fieldId);
    if (element) {
      element.classList.add("field-error-flash");

      setTimeout(() => {
        element.classList.remove("field-error-flash");
        element.classList.add("field-error");
      }, 1500);

      alert(`❌ ${message}`);
      element.focus();
    }
  }

  // 移除單個欄位錯誤樣式
  function removeFieldError(fieldId) {
    const element = document.getElementById(fieldId);
    if (element) {
      element.classList.remove("field-error");
      element.classList.remove("field-error-flash");
      element.classList.add("field-valid");

      setTimeout(() => {
        element.classList.remove("field-valid");
      }, 300);
    }
  }

  // 清除所有欄位錯誤樣式
  function clearFieldErrors() {
    document.querySelectorAll(".required-field").forEach((field) => {
      field.classList.remove("field-error");
      field.classList.remove("field-error-flash");
      field.classList.remove("field-valid");
    });

    // 清除自訂下拉選單的錯誤樣式
    const searchInput = document.getElementById("providerIdSearch");
    if (searchInput) {
      searchInput.classList.remove("field-error");
      searchInput.classList.remove("field-error-flash");
      searchInput.classList.remove("field-valid");
    }
  }

  // 全選/取消全選
  document.getElementById("checkAll").addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".row-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
    updateDeleteButtonVisibility();
  });

  // 監聽單個 checkbox 變化
  document.addEventListener("change", function (e) {
    if (e.target.classList.contains("row-checkbox")) {
      updateDeleteButtonVisibility();
    }
    if (e.target.classList.contains("row-checkbox-import")) {
      updateRemoveButtonVisibility();
    }
  });

  // 批次刪除功能
  document.getElementById("btnDelete").addEventListener("click", function () {
    const checkedBoxes = document.querySelectorAll(".row-checkbox:checked");

    if (checkedBoxes.length === 0) {
      alert("請先勾選要刪除的資料");
      return;
    }

    if (
      confirm(
        `⚠️ 確定要刪除選取的 ${checkedBoxes.length} 筆資料嗎？\n此操作無法復原！`
      )
    ) {
      const start = (currentPage - 1) * pageSize;
      const indicesToDelete = [];

      checkedBoxes.forEach((checkbox) => {
        const row = checkbox.closest("tr");
        const rowIndex = Array.from(row.parentElement.children).indexOf(row);
        indicesToDelete.push(start + rowIndex);
      });

      indicesToDelete
        .sort((a, b) => b - a)
        .forEach((index) => {
          allData.splice(index, 1);
        });

      totalRecords = allData.length;

      if (start >= totalRecords && currentPage > 1) {
        currentPage--;
      }

      updateTable();
      updatePaginationInfo();
      document.getElementById("checkAll").checked = false;
      alert(`✓ 已成功刪除 ${checkedBoxes.length} 筆資料`);
    }
  });

  // ===== 匯入功能 =====

  // 選擇檔案
  const btnSelectFile = document.getElementById("btnSelectFile");
  if (btnSelectFile) {
    btnSelectFile.addEventListener("click", function () {
      console.log("選擇檔案按鈕被點擊");
      document.getElementById("fileInput").click();
    });
  } else {
    console.error("找不到選擇檔案按鈕");
  }

  // 檔案選擇變更 - 實際讀取檔案
  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", function (e) {
      console.log("檔案選擇事件觸發");
      const file = e.target.files[0];

      if (!file) {
        console.log("沒有選擇檔案");
        return;
      }

      console.log(
        "選擇的檔案:",
        file.name,
        "大小:",
        file.size,
        "類型:",
        file.type
      );

      // 顯示檔案名稱
      const fileNameSpan = document.getElementById("fileName");
      if (fileNameSpan) {
        fileNameSpan.textContent = file.name;
      }

      // 檢查檔案大小（10MB）
      if (file.size > 10 * 1024 * 1024) {
        alert("檔案大小超過 10MB，請選擇較小的檔案");
        fileInput.value = "";
        if (fileNameSpan) fileNameSpan.textContent = "尚未選擇檔案";
        return;
      }

      // 檢查檔案類型
      const fileName = file.name.toLowerCase();
      const validExtensions = [".csv", ".xlsx", ".xls"];
      const hasValidExtension = validExtensions.some((ext) =>
        fileName.endsWith(ext)
      );

      if (!hasValidExtension) {
        alert("僅支援 CSV 或 Excel 檔案格式（.csv, .xlsx, .xls）");
        fileInput.value = "";
        if (fileNameSpan) fileNameSpan.textContent = "尚未選擇檔案";
        return;
      }

      console.log("開始讀取檔案...");

      // 讀取檔案
      const reader = new FileReader();

      reader.onload = function (e) {
        try {
          console.log("檔案讀取完成，開始解析...");

          // 檢查 XLSX 是否已載入
          if (typeof XLSX === "undefined") {
            console.error("XLSX 套件未載入");
            alert("檔案讀取套件載入失敗，請重新整理頁面");
            return;
          }

          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          console.log(
            "工作簿讀取成功，工作表數量:",
            workbook.SheetNames.length
          );
          console.log("工作表名稱:", workbook.SheetNames);

          // 取得第一個工作表
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // 轉換為 JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          console.log("轉換為 JSON 完成，資料列數:", jsonData.length);
          console.log("前 3 列資料:", jsonData.slice(0, 3));

          // 解析資料
          parseImportData(jsonData);
        } catch (error) {
          console.error("檔案讀取錯誤:", error);
          alert(`檔案讀取失敗：${error.message}\n\n請確認檔案格式是否正確`);
          fileInput.value = "";
          if (fileNameSpan) fileNameSpan.textContent = "尚未選擇檔案";
        }
      };

      reader.onerror = function (error) {
        console.error("FileReader 錯誤:", error);
        alert("檔案讀取失敗，請重試");
        fileInput.value = "";
        if (fileNameSpan) fileNameSpan.textContent = "尚未選擇檔案";
      };

      reader.readAsArrayBuffer(file);
    });
  } else {
    console.error("找不到檔案輸入元素");
  }

  // 解析匯入資料
  function parseImportData(jsonData) {
    console.log("開始解析匯入資料...");

    if (!jsonData || jsonData.length === 0) {
      alert("檔案中沒有資料");
      return;
    }

    if (jsonData.length < 2) {
      alert("檔案中沒有資料列（只有標題列）");
      return;
    }

    // 第一列為標題
    const headers = jsonData[0];
    console.log("欄位標題:", headers);

    // 檢查標題是否有效
    if (!headers || headers.length === 0) {
      alert("檔案格式錯誤：找不到標題列");
      return;
    }

    // 驗證必要欄位
    const requiredFields = ["任務", "業者代碼", "RW ID", "SAM ID"];
    const missingFields = requiredFields.filter((field) => {
      const found = headers.some((h) => h && h.toString().trim() === field);
      if (!found) {
        console.log(`找不到欄位: ${field}`);
      }
      return !found;
    });

    if (missingFields.length > 0) {
      alert(
        `缺少必要欄位：${missingFields.join(", ")}\n\n` +
          `檔案中的欄位：${headers.filter((h) => h).join(", ")}\n\n` +
          `請確認檔案格式是否正確`
      );
      return;
    }

    // 取得欄位索引
    const fieldIndexes = {
      task: headers.findIndex((h) => h && h.toString().trim() === "任務"),
      providerId: headers.findIndex(
        (h) => h && h.toString().trim() === "業者代碼"
      ),
      providerName: headers.findIndex(
        (h) => h && h.toString().trim() === "業者名稱"
      ),
      rwId: headers.findIndex((h) => h && h.toString().trim() === "RW ID"),
      samId: headers.findIndex((h) => h && h.toString().trim() === "SAM ID"),
    };

    console.log("欄位索引:", fieldIndexes);

    // 解析資料列
    importData = [];
    const errors = [];

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];

      // 跳過空白列
      if (!row || row.length === 0 || row.every((cell) => !cell)) {
        console.log(`第 ${i + 1} 列：空白列，跳過`);
        continue;
      }

      const task = row[fieldIndexes.task]?.toString().trim() || "";
      const providerId = row[fieldIndexes.providerId]?.toString().trim() || "";
      const providerName =
        fieldIndexes.providerName >= 0
          ? row[fieldIndexes.providerName]?.toString().trim() || ""
          : "";
      const rwId = row[fieldIndexes.rwId]?.toString().trim() || "";
      const samId = row[fieldIndexes.samId]?.toString().trim() || "";

      console.log(`第 ${i + 1} 列:`, {
        task,
        providerId,
        providerName,
        rwId,
        samId,
      });

      // 驗證任務欄位
      if (!task || (task !== "開通" && task !== "註銷")) {
        errors.push(
          `第 ${i + 1} 列：任務欄位必須為「開通」或「註銷」（目前值：${
            task || "空白"
          }）`
        );
        continue;
      }

      // 驗證必填欄位
      if (!providerId || !rwId || !samId) {
        const missing = [];
        if (!providerId) missing.push("業者代碼");
        if (!rwId) missing.push("RW ID");
        if (!samId) missing.push("SAM ID");
        errors.push(`第 ${i + 1} 列：缺少必要欄位資料 (${missing.join(", ")})`);
        continue;
      }

      // 新增到匯入資料
      importData.push({
        task: task,
        providerId: providerId,
        providerName: providerName,
        rwId: rwId,
        samId: samId,
      });
    }

    console.log(
      `解析完成，有效資料: ${importData.length} 筆，錯誤: ${errors.length} 筆`
    );

    // 顯示錯誤訊息
    if (errors.length > 0) {
      const errorMsg = errors.slice(0, 5).join("\n");
      const moreErrors =
        errors.length > 5 ? `\n...還有 ${errors.length - 5} 個錯誤` : "";
      alert(
        `發現資料錯誤：\n\n${errorMsg}${moreErrors}\n\n已跳過錯誤資料，繼續處理正確的資料`
      );
    }

    if (importData.length === 0) {
      alert("沒有可匯入的有效資料");
      return;
    }

    // 顯示預覽
    console.log("顯示預覽資料...");
    displayImportPreview();

    console.log(`成功解析 ${importData.length} 筆資料`);
  }

  // 顯示匯入預覽
  function displayImportPreview() {
    console.log("displayImportPreview 被呼叫");

    const tbody = document.getElementById("importPreviewBody");
    if (!tbody) {
      console.error("找不到 importPreviewBody 元素");
      return;
    }

    tbody.innerHTML = "";

    importData.forEach((data, index) => {
      const row = tbody.insertRow();

      // 根據任務類型決定按鈕樣式
      let taskButton;
      if (data.task === "開通") {
        taskButton = `<button class="task-btn task-btn-add" disabled>開通</button>`;
      } else if (data.task === "註銷") {
        taskButton = `<button class="task-btn task-btn-delete" disabled>註銷</button>`;
      } else {
        taskButton = `<span style="color: #999;">未知</span>`;
      }

      row.innerHTML = `
        <td><input type="checkbox" class="row-checkbox-import" data-index="${index}" /></td>
        <td>${data.providerId}</td>
        <td>${
          data.providerName || '<span style="color: #999;">未提供</span>'
        }</td>
        <td>${data.rwId}</td>
        <td>${data.samId}</td>
        <td>${taskButton}</td>
      `;
    });

    const previewCount = document.getElementById("previewCount");
    if (previewCount) {
      previewCount.textContent = `共 ${importData.length} 筆資料`;
    }

    const importPreview = document.getElementById("importPreview");
    if (importPreview) {
      importPreview.style.display = "block";
      console.log("預覽區域已顯示");
    } else {
      console.error("找不到 importPreview 元素");
    }
  }

  // 全選匯入預覽
  const checkAllImport = document.getElementById("checkAllImport");
  if (checkAllImport) {
    checkAllImport.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll(".row-checkbox-import");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = this.checked;
      });
      updateRemoveButtonVisibility();
    });
  }

  // 移除選取的預覽項目
  const btnRemoveSelected = document.getElementById("btnRemoveSelected");
  if (btnRemoveSelected) {
    btnRemoveSelected.addEventListener("click", function () {
      const checkedBoxes = document.querySelectorAll(
        ".row-checkbox-import:checked"
      );

      if (checkedBoxes.length === 0) {
        alert("請先選取要移除的項目");
        return;
      }

      if (!confirm(`確定要移除選取的 ${checkedBoxes.length} 筆資料嗎？`)) {
        return;
      }

      const indicesToRemove = Array.from(checkedBoxes).map((cb) =>
        parseInt(cb.dataset.index)
      );

      indicesToRemove
        .sort((a, b) => b - a)
        .forEach((index) => {
          importData.splice(index, 1);
        });

      if (importData.length === 0) {
        document.getElementById("importPreview").style.display = "none";
        document.getElementById("fileInput").value = "";
        const fileNameSpan = document.getElementById("fileName");
        if (fileNameSpan) fileNameSpan.textContent = "尚未選擇檔案";
      } else {
        displayImportPreview();
      }

      const checkAllImport = document.getElementById("checkAllImport");
      if (checkAllImport) checkAllImport.checked = false;
      updateRemoveButtonVisibility();
    });
  }

  // 清空預覽
  const btnClearPreview = document.getElementById("btnClearPreview");
  if (btnClearPreview) {
    btnClearPreview.addEventListener("click", function () {
      if (confirm("確定要清空所有預覽資料嗎？")) {
        importData = [];
        document.getElementById("importPreview").style.display = "none";
        document.getElementById("fileInput").value = "";
        const fileNameSpan = document.getElementById("fileName");
        if (fileNameSpan) fileNameSpan.textContent = "尚未選擇檔案";
      }
    });
  }

  // 取消匯入
  const btnCancelImport = document.getElementById("btnCancelImport");
  if (btnCancelImport) {
    btnCancelImport.addEventListener("click", function () {
      if (confirm("確定要取消匯入嗎？")) {
        importData = [];
        document.getElementById("importPreview").style.display = "none";
        document.getElementById("fileInput").value = "";
        const fileNameSpan = document.getElementById("fileName");
        if (fileNameSpan) fileNameSpan.textContent = "尚未選擇檔案";
      }
    });
  }

  // 執行匯入
  const btnExecuteImport = document.getElementById("btnExecuteImport");
  if (btnExecuteImport) {
    btnExecuteImport.addEventListener("click", function () {
      if (importData.length === 0) {
        alert("沒有可匯入的資料");
        return;
      }

      const addCount = importData.filter((d) => d.task === "開通").length;
      const deleteCount = importData.filter((d) => d.task === "註銷").length;

      if (
        !confirm(
          `確定要執行匯入嗎？\n\n` +
            `開通：${addCount} 筆\n` +
            `註銷：${deleteCount} 筆\n` +
            `總計：${importData.length} 筆`
        )
      ) {
        return;
      }

      let successCount = 0;
      let failCount = 0;
      const results = [];

      importData.forEach((data) => {
        try {
          if (data.task === "開通") {
            // 檢查是否已存在
            const exists = allData.some(
              (item) => item.rwId === data.rwId && item.samId === data.samId
            );

            if (exists) {
              results.push(
                `❌ 開通失敗：RW ID [${data.rwId}] 和 SAM ID [${data.samId}] 已存在`
              );
              failCount++;
            } else {
              allData.unshift(data);
              results.push(`✓ 開通成功：RW ID [${data.rwId}]`);
              successCount++;
            }
          } else if (data.task === "註銷") {
            // 尋找並刪除
            const index = allData.findIndex(
              (item) => item.rwId === data.rwId && item.samId === data.samId
            );

            if (index !== -1) {
              allData.splice(index, 1);
              results.push(`✓ 註銷成功：RW ID [${data.rwId}]`);
              successCount++;
            } else {
              results.push(
                `❌ 註銷失敗：找不到 RW ID [${data.rwId}] 和 SAM ID [${data.samId}]`
              );
              failCount++;
            }
          }
        } catch (error) {
          results.push(`❌ 處理失敗：${data.rwId} - ${error.message}`);
          failCount++;
        }
      });

      totalRecords = allData.length;
      currentPage = 1;
      updateTable();
      updatePaginationInfo();

      importData = [];
      document.getElementById("importPreview").style.display = "none";
      document.getElementById("fileInput").value = "";
      const fileNameSpan = document.getElementById("fileName");
      if (fileNameSpan) fileNameSpan.textContent = "尚未選擇檔案";

      // 顯示詳細結果
      const resultMsg = results.slice(0, 10).join("\n");
      const moreResults =
        results.length > 10 ? `\n...還有 ${results.length - 10} 筆結果` : "";

      alert(
        `匯入完成！\n\n` +
          `成功：${successCount} 筆\n` +
          `失敗：${failCount} 筆\n\n` +
          `詳細結果：\n${resultMsg}${moreResults}`
      );

      document.querySelector('[data-tab="maintenance"]').click();
    });
  }
}

// 重置新增表單欄位狀態的輔助函數
function resetAddFormFields() {
  const addproviderId = document.getElementById("addproviderId");
  const addRwId = document.getElementById("addRwId");
  const addSamId = document.getElementById("addSamId");

  // 解除所有欄位的鎖定
  if (addproviderId) {
    addproviderId.disabled = false;
    addproviderId.style.backgroundColor = "";
    addproviderId.style.cursor = "";
  }

  if (addRwId) {
    addRwId.readOnly = false;
    addRwId.style.backgroundColor = "";
    addRwId.style.cursor = "";
  }

  if (addSamId) {
    addSamId.readOnly = false;
    addSamId.style.backgroundColor = "";
    addSamId.style.cursor = "";
  }
}

// 頁面載入時初始化
window.addEventListener("DOMContentLoaded", function () {
  console.log("頁面載入完成，開始初始化");
  initializePagination();
  setupPaginationButtons();
  initializeEventListeners();
  console.log("初始化完成");
});
