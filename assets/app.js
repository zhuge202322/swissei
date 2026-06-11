(function () {
  var SEARCH = new URLSearchParams(window.location.search);

  var TEXT = {
    zh: {
      homeTitle: "Swisse 斯维诗防伪查询",
      resultTitle: "Swisse 防伪查询结果",
      heading: "SWISSE产品正品验证",
      intro: "请确认防伪码类型，刮开涂层或开启包装顶部盒盖，查询5位防伪数字",
      scratchType: "涂层款",
      boxType: "盒盖款",
      serialLabel: "产品序列号:",
      autoSerial: "自动识别",
      placeholder: "请输入5位防伪码数字",
      verifyButton: "验证",
      verifying: "验证中",
      inputError: "请输入5位防伪码数字",
      systemError: "系统繁忙，请稍后再试",
      note1: "* 部分没有印刷防伪码产品暂不支持查询",
      note2: "* Swisse防伪查询唯一合法域名为swisse.com，正品经扫码可直接从本页网址看到或点击微信扫码后界面右上角[...]看到swisse.com域名，请注意甄别，谨防受骗。",
      social: "关注官方账号及时获取更多精彩资讯",
      locationTitle: "是否允许‘Swisse斯维诗防伪查询’获取此设备的位置信息？以帮助我们更好的建立防伪体系",
      allow: "同意授权",
      deny: "拒绝",
      close: "关闭",
      genuineHeading: "查询产品为正品",
      genuineMessage: "该产品为第 {count} 次查询，请放心使用",
      highHeading: "高频查询，谨防假冒",
      highMessage: "该产品查询次数超过{limit}次！如标签涂层未刮开，则产品为仿冒产品",
      errorHeading: "防伪码错误",
      errorMessage: "您所输入的防伪码不正确，请检查是否有误。如果无误，则该产品为假冒产品。",
      back: "返回",
      service: "联系客服",
      serviceNotice: "请联系官方客服"
    },
    id: {
      homeTitle: "Pemeriksaan Keaslian Swisse",
      resultTitle: "Hasil Pemeriksaan Swisse",
      heading: "VERIFIKASI KEASLIAN PRODUK SWISSE",
      intro: "Pastikan jenis kode anti-pemalsuan, gosok lapisan atau buka tutup kotak bagian atas, lalu masukkan 5 digit angka anti-pemalsuan",
      scratchType: "Model lapisan gosok",
      boxType: "Model tutup kotak",
      serialLabel: "Nomor seri produk:",
      autoSerial: "Identifikasi otomatis",
      placeholder: "Masukkan 5 digit kode anti-pemalsuan",
      verifyButton: "Verifikasi",
      verifying: "Memverifikasi",
      inputError: "Masukkan 5 digit kode anti-pemalsuan",
      systemError: "Sistem sedang sibuk. Silakan coba lagi nanti.",
      note1: "* Beberapa produk tanpa kode anti-pemalsuan cetak belum mendukung pemeriksaan",
      note2: "* Domain resmi untuk pemeriksaan anti-pemalsuan Swisse adalah swisse.com. Pastikan domain yang terlihat adalah swisse.com untuk menghindari penipuan.",
      social: "Ikuti akun resmi untuk mendapatkan informasi terbaru",
      locationTitle: "Izinkan ‘Pemeriksaan Anti-Pemalsuan Swisse’ mengakses lokasi perangkat ini? Ini membantu kami membangun sistem anti-pemalsuan yang lebih baik.",
      allow: "Izinkan",
      deny: "Tolak",
      close: "Tutup",
      genuineHeading: "Produk yang diperiksa adalah asli",
      genuineMessage: "Produk ini adalah pemeriksaan ke-{count}. Silakan digunakan dengan yakin.",
      highHeading: "Frekuensi pemeriksaan tinggi",
      highMessage: "Produk ini telah diperiksa lebih dari {limit} kali! Jika lapisan label belum digosok, produk ini adalah produk tiruan.",
      errorHeading: "Kode anti-pemalsuan salah",
      errorMessage: "Kode anti-pemalsuan yang Anda masukkan tidak benar. Periksa kembali. Jika tidak ada kesalahan, produk ini adalah produk palsu.",
      back: "Kembali",
      service: "Hubungi layanan pelanggan",
      serviceNotice: "Silakan hubungi layanan pelanggan resmi"
    }
  };

  function normalizeLang(value) {
    var lang = String(value || "").toLowerCase();
    return lang.indexOf("id") === 0 || lang.indexOf("in") === 0 ? "id" : "zh";
  }

  function getLang() {
    return normalizeLang(SEARCH.get("lang") || SEARCH.get("locale") || window.navigator.language);
  }

  var LANG = getLang();
  var COPY = TEXT[LANG] || TEXT.zh;

  function getSerial() {
    return (SEARCH.get("sn") || SEARCH.get("serial") || SEARCH.get("product") || "").replace(/\D/g, "").slice(0, 20);
  }

  function getCode() {
    return (SEARCH.get("code") || "").replace(/\D/g, "").slice(0, 5);
  }

  function getCount() {
    return (SEARCH.get("count") || "1").replace(/\D/g, "") || "1";
  }

  function pageUrl(page, serial, code, count) {
    var params = new URLSearchParams();
    if (serial) params.set("sn", serial);
    if (code) params.set("code", code);
    if (count) params.set("count", String(count));
    params.set("lang", LANG);
    return page + "?" + params.toString();
  }

  function setDocumentLanguage() {
    document.documentElement.lang = LANG === "id" ? "id-ID" : "zh-CN";
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function applyHomeCopy() {
    document.title = COPY.homeTitle;
    setText(".verify-content h1", COPY.heading);
    setText(".intro", COPY.intro);
    setText(".notes p:nth-child(1)", COPY.note1);
    setText(".notes p:nth-child(2)", COPY.note2);
    setText(".social-footer p", COPY.social);
    setText(".modal-card h2", COPY.locationTitle);

    var captions = document.querySelectorAll(".guide-item figcaption");
    if (captions[0]) captions[0].textContent = COPY.scratchType;
    if (captions[1]) captions[1].textContent = COPY.boxType;

    var label = document.querySelector(".serial-label");
    if (label && label.childNodes[0]) label.childNodes[0].nodeValue = COPY.serialLabel + " ";

    var input = document.getElementById("code-input");
    if (input) input.setAttribute("placeholder", COPY.placeholder);

    var submit = document.querySelector(".verify-form .primary-button");
    if (submit) submit.textContent = COPY.verifyButton;

    var close = document.querySelector(".modal-close");
    if (close) close.setAttribute("aria-label", COPY.close);

    var allow = document.querySelector("[data-location-choice='allow']");
    var deny = document.querySelector("[data-location-choice='deny']");
    if (allow) allow.textContent = COPY.allow;
    if (deny) deny.textContent = COPY.deny;
  }

  function applyResultCopy() {
    var result = document.body.dataset.result;
    var count = getCount();
    var title = document.querySelector(".result-content h1");
    var message = document.querySelector(".result-message p");

    document.title = COPY.resultTitle;

    if (result === "genuine") {
      if (title) title.textContent = COPY.genuineHeading;
      if (message) message.innerHTML = COPY.genuineMessage.replace("{count}", '<span id="query-count">' + count + "</span>");
    }

    if (result === "high") {
      if (title) title.textContent = COPY.highHeading;
      if (message) message.innerHTML = COPY.highMessage.replace("{limit}", '<span class="danger-text">10</span>');
    }

    if (result === "error") {
      if (title) title.textContent = COPY.errorHeading;
      if (message) message.textContent = COPY.errorMessage;
    }

    document.querySelectorAll("[data-action='back']").forEach(function (button) {
      button.textContent = COPY.back;
    });
    document.querySelectorAll("[data-action='service']").forEach(function (button) {
      button.textContent = COPY.service;
    });
  }

  function setupHome() {
    var serial = getSerial();
    var codeFromQuery = getCode();
    var form = document.getElementById("verify-form");
    var serialDisplay = document.getElementById("serial-display");
    var codeInput = document.getElementById("code-input");
    var error = document.getElementById("form-error");
    var modal = document.getElementById("location-modal");
    var submit = form ? form.querySelector(".primary-button") : null;
    var pendingCode = "";

    if (!form || !serialDisplay || !codeInput || !modal) return;

    applyHomeCopy();
    serialDisplay.textContent = serial || COPY.autoSerial;
    if (codeFromQuery && !codeInput.value) codeInput.value = codeFromQuery;

    function setLoading(isLoading) {
      codeInput.disabled = isLoading;
      if (submit) {
        submit.disabled = isLoading;
        submit.textContent = isLoading ? COPY.verifying : COPY.verifyButton;
      }
    }

    codeInput.addEventListener("input", function () {
      codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 5);
      error.textContent = "";
    });

    function openModal() {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }

    async function finishVerification(code) {
      setLoading(true);
      error.textContent = "";

      try {
        var response = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            serial: serial,
            code: code
          })
        });
        var data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.error || "verify_failed");
        }

        var resultSerial = data.serial && data.serial !== "test" ? data.serial : serial;

        if (data.result === "error") {
          window.location.href = pageUrl("result-error.html", serial, code);
          return;
        }

        if (data.result === "high") {
          window.location.href = pageUrl("result-high-frequency.html", resultSerial, code, data.count || 11);
          return;
        }

        window.location.href = pageUrl("result-genuine.html", resultSerial, code, data.count || 1);
      } catch (err) {
        error.textContent = COPY.systemError;
        setLoading(false);
      }
    }

    function requestLocation(choice) {
      closeModal();
      if (document.body.dataset.demoModal === "true") return;

      if (choice === "allow" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function () {
            finishVerification(pendingCode);
          },
          function () {
            finishVerification(pendingCode);
          },
          { enableHighAccuracy: false, timeout: 3000, maximumAge: 600000 }
        );
        return;
      }

      finishVerification(pendingCode);
    }

    modal.addEventListener("click", function (event) {
      var control = event.target.closest("[data-location-choice]");
      if (!control) return;
      requestLocation(control.getAttribute("data-location-choice"));
    });

    if (document.body.dataset.demoModal === "true") {
      openModal();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var code = codeInput.value.replace(/\D/g, "").slice(0, 5);
      if (code.length !== 5) {
        error.textContent = COPY.inputError;
        codeInput.focus();
        return;
      }

      pendingCode = code;
      openModal();
    });
  }

  function setupResult() {
    var serial = getSerial();
    applyResultCopy();

    document.querySelectorAll("[data-action='back']").forEach(function (button) {
      button.addEventListener("click", function () {
        window.location.href = pageUrl("index.html", serial);
      });
    });

    document.querySelectorAll("[data-action='service']").forEach(function (button) {
      button.addEventListener("click", function () {
        button.textContent = COPY.serviceNotice;
      });
    });
  }

  setDocumentLanguage();
  if (document.body.dataset.page === "home") setupHome();
  if (document.body.dataset.page === "result") setupResult();
})();
