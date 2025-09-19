(function () {
  'use strict';

  const vLSYr1 = "yr1";
  const vLS8734 = "8.734";
  const vA = ["0712"];
  const vO = {
    API_TIMEOUT: 30000,
    NOTIFICATION_TIMEOUT_SHORT: 3500,
    NOTIFICATION_TIMEOUT_LONG: 7000,
    GEMINI_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    API_KEYS: ["AIzaSyDdGLTevcXNrdq8tFwTFw0_OaHmaI3tcmE", "AIzaSyAkfQ7w36m7e_7uRSIiyapXr2ZiLqR4Fes", "AIzaSyB-mcRX-XdOWkpHBlJdubOWAkoMoLHNxvA", "AIzaSyDe8Zt_paudG3ThLWEmySDcv50fOUNaRO0", "AIzaSyCMT0fTxtud0oobuYJQToEOUIWFG7A5aOM", "AIzaSyDxJWU0jjJqZJxbrVFQQaEvlg-6t6FGC9g", "AIzaSyB-pZW4L83w7EyoIL5Vt8nr3bVYJEMVLtY", "AIzaSyAuCO-D2-WFT-0K69folvLkuW-phcJcGQI", "AIzaSyDCni80HoIPt7UKHhMaFWlQYyqg8-ET9K4", "AIzaSyA_T9O89TBYjpp1XSIAJFqdyI1WW7execU", "AIzaSyA2OCjx8Zl5C05Hl_57srvobTM34VdPBxo", "AIzaSyCr30K9HoTArlagS4udtIZ9jKmr7guKSe8", "AIzaSyAO-t3y3k6r3vph9Jt0_YrZ2MHEopclyvo"],
    IMAGE_FILTERS: {
      blocked: [/icon/i, /button/i, /banner/i, /avatar/i, /profile/i, /thumb/i, /sprite/i, /_logo\./i, /\.svg$/i, /captcha/i, /loading/i, /spinner/i, /placeholder/i, /background/i, /shim\.gif/i, /ad\./i, /advert/i, /tracking/i, /pixel/i, /beacon/i, /edusp-static\.ip\.tv\/(?:tms|sala-do-futuro)\//i, /s3\.sa-east-1\.amazonaws\.com\/edusp-static\.ip\.tv\/room\/cards\//i, /conteudo_logo\.png$/i, /logo_sala_do_futuro\.png$/i, /pattern/i, /texture/i, /favicon/i, /asset/i, /static/i, /decorator/i, /spacer/i, /dummy/i, /transparent/i, /white\.png/i, /black\.png/i, /grey\.png/i, /gray\.png/i, /1x1/i, /blank\.gif/i, /clear\.gif/i],
      verify(p) {
        if (!p || typeof p !== "string" || !p.startsWith("http") && !p.startsWith("data:image")) {
          return false;
        }
        if (this.blocked.some(p2 => p2.test(p))) {
          return false;
        }
        return true;
      }
    }
  };
  const vO2 = {
    logMessages: [],
    lastAnswer: null,
    isCycleRunning: false,
    ui: {},
    isAuthenticated: false,
    lastCycleTime: 0,
    debugConsole: {
      isOpen: false,
      logs: [],
      commandHistory: [],
      historyIndex: -1
    }
  };
  const vO3 = {
    font: "'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace",
    bg: "rgba(0, 0, 0, 0.95)",
    bg2: "rgba(15, 15, 15, 0.9)",
    bg3: "rgba(25, 25, 25, 0.8)",
    text: "#ffffff",
    text2: "#e0e0e0",
    accent: "#fff",
    success: "#fff",
    error: "#fff",
    warn: "#fff",
    info: "#ffffff",
    pulse: "#ffffff",
    border: "rgba(255, 255, 255, 0.2)",
    border2: "rgba(255, 255, 255, 0.1)",
    notifBg: "rgba(0, 0, 0, 0.95)",
    glow: "0 0 20px rgba(255, 255, 255, 0.3)",
    consoleBg: "rgba(0, 0, 0, 0.95)",
    consoleInput: "rgba(25, 25, 25, 0.9)",
    blur: "blur(15px)"
  };
  const vF = (p3, ..._0x5c1582) => {
    const v = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3
    });
    const vO4 = {
      ts: v,
      level: p3,
      message: _0x5c1582.join(" ")
    };
    vO2.logMessages.push(vO4);
    vO2.debugConsole.logs.push(vO4);
    if (vO2.debugConsole.isOpen && vO2.ui.debugConsole) {
      vO2.ui.debugConsole.addLog(vO4);
    }
    const v2 = console[p3.toLowerCase()] || console.log;
    v2("[R6 " + v + "]", ..._0x5c1582);
  };
  const vF2 = (p4, p5) => Promise.race([p4, new Promise((p6, p7) => setTimeout(() => p7(new Error("Timeout " + p5 + "ms")), p5))]);
  function f(p8) {
    if (typeof p8 !== "string") {
      return "";
    }
    return p8.replace(/\n\s*\n/g, "\n").replace(/ {2,}/g, " ").trim();
  }
  function f2(p9) {
    if (!p9) {
      return "";
    }
    if (p9.nodeType === Node.TEXT_NODE) {
      return p9.nodeValue;
    }
    if (p9.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }
    if (p9.offsetParent === null && p9.style.display !== "flex" || p9.style.display === "none") {
      return "";
    }
    const v3 = p9.tagName.toUpperCase();
    if (v3 === "IMG") {
      try {
        const v4 = p9.src || p9.dataset.src;
        if (!v4) {
          return "";
        }
        const v5 = new URL(v4, window.location.href).toString();
        if (vO.IMAGE_FILTERS.verify(v5)) {
          return " [IMAGEM]: " + v5 + " ";
        }
      } catch (e) {}
      return "";
    }
    if (p9.matches("mjx-container, .MathJax, .katex, math")) {
      let v6 = p9.getAttribute("aria-label") || p9.dataset.latex || p9.querySelector("annotation[encoding*=\"tex\"]")?.textContent || "";
      if (v6.trim()) {
        return " $" + v6.trim() + "$ ";
      }
    }
    let vLS = "";
    if (p9.hasChildNodes()) {
      for (const v7 of p9.childNodes) {
        vLS += f2(v7);
      }
    }
    if (["P", "DIV", "H1", "H2", "H3", "LI", "BLOCKQUOTE", "BR", "TR"].includes(v3)) {
      return vLS + "\n";
    }
    return vLS;
  }
  function f3() {
    let v8 = null;
    const vLSDivMuiPaperrootArtic = "div.MuiPaper-root, article[class*=\"question\"], section[class*=\"assessment\"], div[class*=\"questao\"]";
    const v9 = document.querySelectorAll(vLSDivMuiPaperrootArtic);
    for (const v10 of v9) {
      if (v10.closest("#" + vLSYr1)) {
        continue;
      }
      if (v10.querySelector("div[role=\"radiogroup\"], ul[class*=\"option\"], ol[class*=\"choice\"]")) {
        v8 = v10;
        break;
      }
    }
    if (!v8) {
      v8 = document.body;
    }
    let vLS2 = "";
    const v11 = v8.querySelector(".ql-editor, div[class*=\"enunciado\"], .question-statement, .texto-base");
    if (v11 && !v11.closest("div[role=\"radiogroup\"]")) {
      vLS2 = f2(v11);
    } else {
      let vLS3 = "";
      for (const v12 of v8.childNodes) {
        if (v12.nodeType === Node.ELEMENT_NODE && (v12.matches("div[role=\"radiogroup\"], ul[class*=\"option\"], ol[class*=\"choice\"]") || v12.querySelector("div[role=\"radiogroup\"]"))) {
          break;
        }
        vLS3 += f2(v12);
      }
      vLS2 = vLS3;
    }
    vLS2 = f(vLS2);
    const vA2 = [];
    const v13 = v8.querySelector("div[role=\"radiogroup\"], ul[class*=\"option\"], ol[class*=\"choice\"]");
    if (v13) {
      const v14 = Array.from(v13.children).filter(p10 => p10.matches("div, label, li"));
      v14.forEach(p11 => {
        if (vA2.length >= 5) {
          return;
        }
        const v15 = String.fromCharCode(65 + vA2.length);
        let v16 = f2(p11).trim();
        v16 = v16.replace(/^[A-Ea-e][\)\.]\s*/, "").trim();
        if (v16) {
          vA2.push(v15 + ") " + f(v16));
        }
      });
    }
    if (vLS2.trim().length < 5 && vA2.every(p12 => p12.length < 10)) {
      return "Conteúdo insuficiente";
    }
    let v17 = "📝 Enunciado:\n" + (vLS2 || "⚠️ Nenhum enunciado encontrado ");
    if (vA2.length > 0) {
      v17 += "\n\n⭕ Alternativas:\n" + vA2.map((p13, p14) => "  " + String.fromCharCode(65 + p14) + ") " + p13).join("\n");
    } else {
      v17 += "\n\n🚫 Nenhuma alternativa foi detectada";
    }
    return v17.replace(/\n{3,}/g, "\n\n").trim();
  }
  function f4() {
    return vO.API_KEYS[Math.floor(Math.random() * vO.API_KEYS.length)];
  }
  async function f5(p15) {
    const vF4 = f4();
    const v18 = "Veja esse conteúdo e responda o que pede, me dê a resposta direta, sem comentários, conteúdo:\n\n" + p15 + "\n\nResposta:";
    const v19 = await fetch(vO.GEMINI_URL + "?key=" + vF4, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: v18
          }]
        }],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.2
        }
      })
    });
    const v20 = await v19.json();
    if (!v19.ok) {
      throw new Error(v20?.error?.message || "HTTP " + v19.status);
    }
    const v21 = v20.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!v21) {
      throw new Error("Resposta da API inválida.");
    }
    return {
      response: v21,
      model: "Gemini-2.0-Flash"
    };
  }
  function f6(p16) {
    if (typeof p16 !== "string") {
      return null;
    }
    const v22 = p16.trim();
    if (/^[A-E]$/i.test(v22)) {
      return v22.toUpperCase();
    }
    const v23 = v22.match(/\b([A-E])\b/i);
    if (v23) {
      return v23[1].toUpperCase();
    } else {
      return null;
    }
  }
  const vLSR6radiopulsevisual = "r6-radio-pulse-visual";
  function f7(p17) {
    document.querySelectorAll("." + vLSR6radiopulsevisual).forEach(p18 => p18.classList.remove(vLSR6radiopulsevisual));
    if (!p17 || !/^[A-E]$/i.test(p17)) {
      return;
    }
    const v24 = p17.toUpperCase().charCodeAt(0) - 65;
    const v25 = document.querySelectorAll("div[role=\"radiogroup\"] > label, div[role=\"radiogroup\"] > div, ul[class*=\"option\"] > li, ol[class*=\"choice\"] > li");
    if (v25[v24]) {
      const v26 = v25[v24].querySelector(".MuiRadio-root, input[type=radio]") || v25[v24];
      v26.classList.add(vLSR6radiopulsevisual);
    }
  }
  async function f8() {
    if (vO2.isCycleRunning) {
      return;
    }
    vO2.isCycleRunning = true;
    vO2.lastAnswer = null;
    f7(null);
    vF("INFO", "Iniciando ciclo completo...");
    vO2.ui.helpers.showResponse({
      answer: "hackzinho started",
      detail: "Processando dados...",
      type: "info"
    });
    try {
      let vF3 = f3();
      if (vF3.startsWith("Falha")) {
        throw new Error(vF3);
      }
      vF("INFO", "Questão extraída com sucesso");
      const v27 = await vF2(f5(vF3), vO.API_TIMEOUT);
      const vF6 = f6(v27.response);
      if (vF6) {
        vO2.lastAnswer = vF6;
        vF("SUCCESS", "R6 Response: " + vF6);
        vO2.ui.helpers.showResponse({
          answer: "Resposta: " + vF6,
          type: "success"
        });
      } else {
        throw new Error("Nenhuma alternativa encontrada.");
      }
    } catch (e2) {
      vF("ERROR", "System Error:", e2.message);
      vO2.ui.helpers.showResponse({
        answer: "yR6 ERROR",
        detail: e2.message.substring(0, 50),
        type: "error"
      });
    } finally {
      vO2.isCycleRunning = false;
    }
  }
  function f9() {
    vF("WARN", "Desativando hackzinho...");
    document.removeEventListener("keydown", f10, true);
    document.getElementById(vLSYr1)?.remove();
    document.getElementById("r6-pulse-styles")?.remove();
    document.getElementById("r6-notifications-container")?.remove();
    document.getElementById("r6-debug-console")?.remove();
  }
  function f10(p19) {
    if (p19.target.isContentEditable || ["TEXTAREA", "SELECT"].includes(p19.target.tagName)) {
      return;
    }
    if (p19.repeat) {
      return;
    }
    if (p19.ctrlKey && p19.key === "9") {
      p19.preventDefault();
      vO2.ui.debugConsole.toggle();
      return;
    }
    switch (p19.key) {
      case "1":
        p19.preventDefault();
        vO2.ui.helpers.toggleMenu();
        break;
      case "2":
        p19.preventDefault();
        const v28 = Date.now();
        const v29 = v28 - (vO2.lastCycleTime || 0);
        const vLN60000 = 60000;
        vO2.lastCycleTime = v28;
        f8();
        break;
      case "3":
        p19.preventDefault();
        f9();
        break;
    }
  }
  (function () {
    const v31 = document.createElement("button");
    v31.style.position = "fixed";
    v31.style.bottom = "20px";
    v31.style.left = "20px";
    v31.style.zIndex = "9999";
    v31.style.width = "30px";
    v31.style.height = "30px";
    v31.style.background = "black";
    v31.style.border = "none";
    v31.style.opacity = "1";
    v31.style.borderRadius = "12px";
    v31.style.cursor = "pointer";
    v31.addEventListener("click", function (p20) {
      p20.preventDefault();
      const v32 = Date.now();
      const v33 = v32 - (vO2.lastCycleTime || 0);
      const vLN600002 = 60000;
      
      vO2.lastCycleTime = v32;
      f8();
    });
    document.body.appendChild(v31);
  })();
  function f11() {
    return new Promise(p21 => {
      const v35 = document.createElement("div");
      v35.id = "r6-loading-screen";
      v35.style.cssText = "\n                position: fixed;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                background: rgba(0, 0, 0, 0.95);\n                backdrop-filter: " + vO3.blur + ";\n                -webkit-backdrop-filter: " + vO3.blur + ";\n                display: flex;\n                flex-direction: column;\n                justify-content: center;\n                align-items: center;\n                z-index: 10001;\n                font-family: " + vO3.font + ";\n                animation: fadeIn 0.3s ease-out;\n            ";
      const v36 = document.createElement("img");
      v36.src = "https://imgs.search.brave.com/j-BHUGQWVY4a_ENgqSRfs_95IrOptho__c5PV-1M550/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bW90b3JkZW1wZXJz/Lm5sL2ltYWdlcy9w/cm9kdWN0aW1hZ2Vz/L3NtYWxsL0FrcmFw/b3ZpYyUyMFMtWTZT/TzEyLUhBUFQlMjBZ/YW1haGElMjBZWkYl/MjBSNi5wbmc";
      v36.style.cssText = "\n                width: 80px;\n                height: 80px;\n                object-fit: contain;\n            ";
      const v37 = document.createElement("div");
      v37.style.cssText = "\n                width: 300px;\n                height: 6px;\n                background: rgba(255, 255, 255, 0.1);\n                border-radius: 20px;\n                overflow: hidden;\n                margin-bottom: 20px;\n                box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);\n            ";
      const v38 = document.createElement("div");
      v38.style.cssText = "\n                height: 100%;\n                width: 0%;\n                background: linear-gradient(45deg, #ffffff, #e0e0e0);\n                border-radius: 20px;\n                transition: width 0.3s ease;\n                box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);\n            ";
      v37.appendChild(v38);
      const v39 = document.createElement("div");
      v39.style.cssText = "\n                color: " + vO3.text + ";\n                font-size: 16px;\n                font-weight: 600;\n                letter-spacing: 2px;\n                text-transform: uppercase;\n                margin-bottom: 10px;\n            ";
      v39.textContent = "hackzinho";
      const v40 = document.createElement("div");
      v40.style.cssText = "\n                color: " + vO3.text2 + ";\n                font-size: 12px;\n                letter-spacing: 1px;\n            ";
      v40.textContent = "Inicializando...";
      v35.appendChild(v36);
      v35.appendChild(v39);
      v35.appendChild(v40);
      v35.appendChild(v37);
      const vLSstylekeyframesFadeIn = "\n                <style>\n                @keyframes fadeIn {\n                    from { opacity: 0; }\n                    to { opacity: 1; }\n                }\n                @keyframes pulse {\n                    0%, 100% { transform: scale(1); }\n                    50% { transform: scale(1.05); }\n                }\n                @keyframes fadeOut {\n                    from { opacity: 1; }\n                    to { opacity: 0; }\n                }\n                </style>\n            ";
      document.head.insertAdjacentHTML("beforeend", vLSstylekeyframesFadeIn);
      document.body.appendChild(v35);
      let vLN0 = 0;
      const vSetInterval = setInterval(() => {
        vLN0 += Math.random() * 15 + 5;
        if (vLN0 >= 100) {
          vLN0 = 100;
          clearInterval(vSetInterval);
          v38.style.width = "100%";
          v40.textContent = "Concluído!";
          setTimeout(() => {
            v35.style.animation = "fadeOut 0.5s ease-out";
            setTimeout(() => {
              document.body.removeChild(v35);
              p21();
            }, 500);
          }, 800);
        } else {
          v38.style.width = vLN0 + "%";
          const vA3 = ["Carregando sistema...", "Conectando IA...", "Verificando componentes...", "Preparando interface...", "Finalizando..."];
          v40.textContent = vA3[Math.floor(vLN0 / 20)] || "Inicializando...";
        }
      }, 100);
    });
  }
  function f12() {
    const v41 = "\n        #r6-password-modal {\n            position: fixed;\n            bottom: -100px;\n            left: 50%;\n            transform: translateX(-50%);\n            background: transparent;\n            backdrop-filter: none; \n            -webkit-backdrop-filter: none; \n            padding: 25px 40px;\n            border-radius: 20px 20px 0 0;\n            box-shadow: none; \n            border: none; /* Remove a borda */\n            z-index: 10000;\n            font-family: " + vO3.font + ";\n            min-width: 400px;\n            transition: bottom 0.6s cubic-bezier(0.25, 1, 0.5, 1);\n        }\n        \n        #r6-password-modal.show {\n            bottom: 0;\n        }\n        \n\n        \n        #r6-password-input {\n            width: 100%;\n            padding: 15px 20px;\n            background: rgba(0, 0, 0, 0.85);\n            border: 0.5px solid " + vO3.border + ";\n            border-radius: 10px;\n            color: " + vO3.text + ";\n            font-size: 16px;\n            font-family: inherit;\n            outline: none;\n            transition: all 0.3s ease;\n            backdrop-filter: blur(10px);\n            -webkit-backdrop-filter: blur(10px);\n            box-sizing: border-box;\n            margin-bottom: 20px;\n        }\n        \n        #r6-password-input:focus {\n            border-color: " + vO3.accent + ";\n            background: rgba(2, 2, 2, 0.9);\n        }\n        \n        \n        @keyframes shakeError {\n            0%, 100% { transform: translateX(-50%) translateX(0); }\n            25% { transform: translateX(-50%) translateX(-10px); }\n            75% { transform: translateX(-50%) translateX(10px); }\n        }\n        ";
    const v42 = document.createElement("style");
    v42.innerText = v41;
    document.head.appendChild(v42);
    const v43 = document.createElement("div");
    v43.id = "r6-password-modal";
    const v44 = document.createElement("input");
    v44.type = "password";
    v44.id = "r6-password-input";
    v44.placeholder = "••••••••••";
    v43.appendChild(v44);
    document.body.appendChild(v43);
    setTimeout(() => {
      v43.classList.add("show");
    }, 100);
    const vF5 = () => {
        v43.style.bottom = "-100px";
        setTimeout(() => {
          document.body.removeChild(v43);
          vO2.isAuthenticated = true;
          f15();
        }, 600);
    };
    v44.addEventListener("input", (e) => {
      vF5();
    });
    v44.focus();
  }
  function f13() {
    const vLSR6debugconsole = "r6-debug-console";
    const v46 = "\n            #" + vLSR6debugconsole + " {\n                position: fixed;\n                top: 50px;\n                left: 50px;\n                width: 600px;\n                height: 400px;\n                background: rgba(0, 0, 0, 0.95);\n                backdrop-filter: " + vO3.blur + ";\n                -webkit-backdrop-filter: " + vO3.blur + ";\n                border: 1px solid " + vO3.border + ";\n                border-radius: 15px;\n                z-index: 2147483647;\n                font-family: " + vO3.font + ";\n                display: none;\n                flex-direction: column;\n                box-shadow: " + vO3.glow + ", 0 20px 60px rgba(0, 0, 0, 0.8);\n                resize: both;\n                overflow: hidden;\n                min-width: 400px;\n                min-height: 300px;\n            }\n\n            .r6-console-header {\n                display: flex;\n                justify-content: space-between;\n                align-items: center;\n                padding: 15px 20px;\n                background: rgba(15, 15, 15, 0.9);\n                border-bottom: 1px solid " + vO3.border + ";\n                border-radius: 15px 15px 0 0;\n                cursor: move;\n                user-select: none;\n            }\n\n            .r6-console-title {\n                color: " + vO3.accent + ";\n                font-size: 16px;\n                font-weight: 700;\n                text-transform: uppercase;\n                letter-spacing: 1px;\n            }\n\n            .r6-console-controls {\n                display: flex;\n                gap: 10px;\n                align-items: center;\n            }\n\n            .r6-debug-btn {\n                padding: 8px 15px;\n                background: rgba(25, 25, 25, 0.8);\n                border: 1px solid " + vO3.border + ";\n                border-radius: 8px;\n                color: " + vO3.text + ";\n                cursor: pointer;\n                font-size: 12px;\n                font-family: inherit;\n                transition: all 0.2s ease;\n                text-transform: uppercase;\n                font-weight: 600;\n            }\n\n            .r6-debug-btn:hover {\n                background: rgba(35, 35, 35, 0.9);\n                color: " + vO3.accent + ";\n                box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);\n            }\n\n            .r6-console-body {\n                flex: 1;\n                display: flex;\n                flex-direction: column;\n                overflow: hidden;\n            }\n\n            .r6-console-tabs {\n                display: flex;\n                background: rgba(10, 10, 10, 0.8);\n                border-bottom: 1px solid " + vO3.border + ";\n            }\n\n            .r6-debug-tab {\n                padding: 12px 20px;\n                background: transparent;\n                border: none;\n                color: " + vO3.text2 + ";\n                cursor: pointer;\n                font-family: inherit;\n                font-size: 13px;\n                border-bottom: 2px solid transparent;\n                transition: all 0.2s ease;\n                text-transform: uppercase;\n                font-weight: 600;\n            }\n\n            .r6-debug-tab.active, .r6-debug-tab:hover {\n                color: " + vO3.accent + ";\n                border-bottom-color: " + vO3.accent + ";\n                background: rgba(25, 25, 25, 0.5);\n            }\n\n            .r6-console-content {\n                flex: 1;\n                overflow-y: auto;\n                padding: 15px;\n                background: rgba(0, 0, 0, 0.8);\n            }\n\n            .r6-log-entry {\n                display: flex;\n                margin-bottom: 8px;\n                font-size: 13px;\n                line-height: 1.4;\n                align-items: flex-start;\n                gap: 10px;\n                padding: 5px;\n                border-radius: 5px;\n                transition: background 0.2s ease;\n            }\n\n            .r6-log-entry:hover {\n                background: rgba(255, 255, 255, 0.05);\n            }\n\n            .r6-log-time {\n                color: " + vO3.text2 + ";\n                min-width: 80px;\n                font-size: 11px;\n                opacity: 0.8;\n            }\n\n            .r6-log-level {\n                min-width: 60px;\n                font-weight: 700;\n                text-transform: uppercase;\n                font-size: 11px;\n                padding: 2px 6px;\n                border-radius: 3px;\n            }\n\n            .r6-log-level.info { color: " + vO3.info + "; background: rgba(255, 255, 255, 0.1); }\n            .r6-log-level.success { color: " + vO3.success + "; background: rgba(255, 255, 255, 0.1); }\n            .r6-log-level.error { color: " + vO3.error + "; background: rgba(255, 68, 68, 0.1); }\n            .r6-log-level.warn { color: " + vO3.warn + "; background: rgba(255, 204, 0, 0.1); }\n            .r6-log-level.log { color: " + vO3.accent + "; background: rgba(255, 255, 255, 0.1); }\n\n            .r6-log-message {\n                color: " + vO3.text + ";\n                flex: 1;\n                word-break: break-word;\n            }\n\n            .r6-console-input-area {\n                border-top: 1px solid " + vO3.border + ";\n                padding: 15px;\n                background: rgba(15, 15, 15, 0.9);\n                display: flex;\n                align-items: center;\n                gap: 10px;\n            }\n\n            .r6-console-prompt {\n                color: " + vO3.accent + ";\n                font-weight: 700;\n                font-size: 14px;\n            }\n\n            .r6-console-input {\n                flex: 1;\n                background: rgba(25, 25, 25, 0.8);\n                border: 1px solid " + vO3.border2 + ";\n                border-radius: 8px;\n                padding: 10px 15px;\n                color: " + vO3.text + ";\n                font-family: inherit;\n                font-size: 13px;\n                outline: none;\n                backdrop-filter: blur(10px);\n                -webkit-backdrop-filter: blur(10px);\n            }\n\n            .r6-console-input:focus {\n                border-color: " + vO3.accent + ";\n                box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);\n            }\n\n            .r6-system-info {\n                background: rgba(15, 15, 15, 0.8);\n                border: 1px solid " + vO3.border + ";\n                border-radius: 10px;\n                padding: 15px;\n                margin-bottom: 15px;\n                backdrop-filter: blur(10px);\n                -webkit-backdrop-filter: blur(10px);\n            }\n\n            .r6-system-info h4 {\n                color: " + vO3.accent + ";\n                margin: 0 0 10px 0;\n                font-size: 14px;\n                text-transform: uppercase;\n                font-weight: 700;\n            }\n\n            .r6-system-info div {\n                color: " + vO3.text2 + ";\n                font-size: 12px;\n                margin-bottom: 5px;\n            }\n        ";
    const v47 = document.createElement("style");
    v47.innerText = v46;
    document.head.appendChild(v47);
    const v48 = document.createElement("div");
    v48.id = vLSR6debugconsole;
    const v49 = document.createElement("div");
    v49.className = "r6-console-header";
    const v50 = document.createElement("div");
    v50.className = "r6-console-title";
    v50.textContent = "R6 Debug Console";
    const v51 = document.createElement("div");
    v51.className = "r6-console-controls";
    const v52 = document.createElement("button");
    v52.className = "r6-debug-btn";
    v52.textContent = "Clear";
    v52.onclick = () => vF8();
    const v53 = document.createElement("button");
    v53.className = "r6-debug-btn";
    v53.textContent = "✕";
    v53.onclick = () => vF7();
    v51.append(v52, v53);
    v49.append(v50, v51);
    const v54 = document.createElement("div");
    v54.className = "r6-console-body";
    const v55 = document.createElement("div");
    v55.className = "r6-console-tabs";
    const v56 = document.createElement("button");
    v56.className = "r6-debug-tab active";
    v56.textContent = "Console";
    v56.onclick = () => vF9("console");
    const v57 = document.createElement("button");
    v57.className = "r6-debug-tab";
    v57.textContent = "System";
    v57.onclick = () => vF9("system");
    v55.append(v56, v57);
    const v58 = document.createElement("div");
    v58.className = "r6-console-content";
    v58.id = "r6-debug-content";
    const v59 = document.createElement("div");
    v59.className = "r6-console-input-area";
    const v60 = document.createElement("span");
    v60.className = "r6-console-prompt";
    v60.textContent = "R6>";
    const v61 = document.createElement("input");
    v61.className = "r6-console-input";
    v61.placeholder = "Digite um comando...";
    v59.append(v60, v61);
    v54.append(v55, v58, v59);
    v48.append(v49, v54);
    document.body.appendChild(v48);
    let v62 = false;
    let vLN02 = 0;
    let vLN03 = 0;
    v49.addEventListener("mousedown", p23 => {
      v62 = true;
      vLN02 = p23.clientX - v48.offsetLeft;
      vLN03 = p23.clientY - v48.offsetTop;
      v48.style.cursor = "grabbing";
    });
    document.addEventListener("mousemove", p24 => {
      if (v62) {
        const v63 = p24.clientX - vLN02;
        const v64 = p24.clientY - vLN03;
        const v65 = window.innerWidth - v48.offsetWidth;
        const v66 = window.innerHeight - v48.offsetHeight;
        v48.style.left = Math.max(0, Math.min(v63, v65)) + "px";
        v48.style.top = Math.max(0, Math.min(v64, v66)) + "px";
      }
    });
    document.addEventListener("mouseup", () => {
      v62 = false;
      v48.style.cursor = "default";
    });
    let vLSConsole = "console";
    const vF7 = () => {
      const v67 = v48.style.display === "flex";
      v48.style.display = v67 ? "none" : "flex";
      vO2.debugConsole.isOpen = !v67;
      if (!v67) {
        vF10();
      }
    };
    const vF8 = () => {
      vO2.debugConsole.logs = [];
      vF10();
    };
    const vF9 = p25 => {
      vLSConsole = p25;
      document.querySelectorAll(".r6-debug-tab").forEach(p26 => p26.classList.remove("active"));
      event.target.classList.add("active");
      if (p25 === "console") {
        vF10();
      } else if (p25 === "system") {
        vF11();
      }
    };
    const vF10 = () => {
      v58.innerHTML = "";
      vO2.debugConsole.logs.forEach(p27 => {
        const v68 = document.createElement("div");
        v68.className = "r6-log-entry";
        v68.innerHTML = "\n                    <span class=\"r6-log-time\">" + p27.ts + "</span>\n                    <span class=\"r6-log-level " + p27.level.toLowerCase() + "\">" + p27.level + "</span>\n                    <span class=\"r6-log-message\">" + p27.message + "</span>\n                ";
        v58.appendChild(v68);
      });
      v58.scrollTop = v58.scrollHeight;
    };
    const vF11 = () => {
      v58.innerHTML = "\n                <div class=\"r6-system-info\">\n                    <h4>hackzinho Information</h4>\n                    <div>Version: " + vLS8734 + "</div>\n                    <div>Status: " + (vO2.isAuthenticated ? "Authenticated" : "Not Authenticated") + "</div>\n                    <div>Engine: " + (vO2.isCycleRunning ? "Running" : "Idle") + "</div>\n                    <div>Last Response: " + (vO2.lastAnswer || "None") + "</div>\n                    <div>Cooldown: " + (() => {
        const v69 = Date.now();
        const v70 = v69 - (vO2.lastCycleTime || 0);
        const v71 = Math.max(0, Math.ceil((60000 - v70) / 1000));
        if (v71 > 0) {
          return v71 + "s remaining";
        } else {
          return "Ready";
        }
      })() + "</div>\n                </div>\n                <div class=\"r6-system-info\">\n                    <h4>API Configuration</h4>\n                    <div>Available Keys: " + vO.API_KEYS.length + "</div>\n                    <div>Timeout: " + vO.API_TIMEOUT + "ms</div>\n                    <div>Model: Gemini-2.0-Flash</div>\n                </div>\n                <div class=\"r6-system-info\">\n                    <h4>Environment Information</h4>\n                    <div>Browser: " + navigator.userAgent.split(" ")[0] + "</div>\n                    <div>URL: " + window.location.hostname + "</div>\n                    <div>Timestamp: " + new Date().toISOString() + "</div>\n                </div>\n            ";
    };
    const vF12 = p28 => {
      if (vLSConsole === "console") {
        const v72 = document.createElement("div");
        v72.className = "r6-log-entry";
        v72.innerHTML = "\n                    <span class=\"r6-log-time\">" + p28.ts + "</span>\n                    <span class=\"r6-log-level " + p28.level.toLowerCase() + "\">" + p28.level + "</span>\n                    <span class=\"r6-log-message\">" + p28.message + "</span>\n                ";
        v58.appendChild(v72);
        v58.scrollTop = v58.scrollHeight;
      }
    };
    const vF13 = p29 => {
      const v73 = p29.trim();
      if (!v73) {
        return;
      }
      vO2.debugConsole.commandHistory.push(v73);
      vO2.debugConsole.historyIndex = vO2.debugConsole.commandHistory.length;
      vF("INFO", "Command: " + v73);
      try {
        switch (v73.toLowerCase()) {
          case "clear":
            vF8();
            break;
          case "help":
          case "cmds":
            vF("INFO", "Available commands: clear, help, status, apikeys, cycle, reset, log");
            break;
          case "status":
            const v74 = Date.now();
            const v75 = v74 - (vO2.lastCycleTime || 0);
            const v76 = Math.max(0, Math.ceil((60000 - v75) / 1000));
            vF("INFO", "yR6 Status: Auth=" + vO2.isAuthenticated + ", Running=" + vO2.isCycleRunning + ", Answer=" + vO2.lastAnswer + ", Cooldown=" + v76 + "s");
            break;
          case "apikeys":
            vF("INFO", "API Keys loaded: " + vO.API_KEYS.length);
            break;
          case "cycle":
            f8();
            break;
          case "reset":
            vO2.lastAnswer = null;
            vO2.isCycleRunning = false;
            vO2.lastCycleTime = 0;
            vF("INFO", "hackzinho Reset (including cooldown)");
            break;
          default:
            if (v73.startsWith("log ")) {
              const v77 = v73.substring(4).trim();
              if (v77) {
                const v78 = v77.replace(/^["']|["']$/g, "");
                vF("LOG", v78);
              } else {
                vF("WARN", "Log message cannot be empty");
              }
            } else {
              const vEval = eval(v73);
              vF("INFO", "Result: " + vEval);
            }
        }
      } catch (e3) {
        vF("ERROR", "Command error: " + e3.message);
      }
      v61.value = "";
    };
    v61.addEventListener("keydown", p30 => {
      if (p30.key === "Enter") {
        vF13(v61.value);
      } else if (p30.key === "ArrowUp") {
        p30.preventDefault();
        if (vO2.debugConsole.historyIndex > 0) {
          vO2.debugConsole.historyIndex--;
          v61.value = vO2.debugConsole.commandHistory[vO2.debugConsole.historyIndex];
        }
      } else if (p30.key === "ArrowDown") {
        p30.preventDefault();
        if (vO2.debugConsole.historyIndex < vO2.debugConsole.commandHistory.length - 1) {
          vO2.debugConsole.historyIndex++;
          v61.value = vO2.debugConsole.commandHistory[vO2.debugConsole.historyIndex];
        } else {
          vO2.debugConsole.historyIndex = vO2.debugConsole.commandHistory.length;
          v61.value = "";
        }
      }
    });
    return {
      toggle: vF7,
      addLog: vF12,
      clear: vF8
    };
  }
  function f14() {
    const v79 = "\n          @keyframes r6-pulse-strong-visual {\n            0% {\n              box-shadow: 0 0 0 0 " + vO3.pulse + "b3;\n            }\n            70% {\n              box-shadow: 0 0 0 16px " + vO3.pulse + "00;\n            }\n            100% {\n              box-shadow: 0 0 0 0 " + vO3.pulse + "00;\n            }\n          }\n        ";
    const v80 = document.createElement("style");
    v80.id = "r6-pulse-styles";
    v80.textContent = "\n          " + v79 + "\n          ." + vLSR6radiopulsevisual + " {\n            border-radius: 50% !important;\n            animation: r6-pulse-strong-visual 1.5s infinite cubic-bezier(0.66, 0, 0, 1);\n            z-index: 9999;\n            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8) !important;\n          }\n        ";
    document.head.appendChild(v80);
    const v81 = document.createElement("div");
    v81.id = vLSYr1;
    v81.style.cssText = "\n          position: fixed;\n          bottom: 20px;\n          right: 20px;\n          z-index: 2147483646;\n          font-family: " + vO3.font + ";\n        ";
    const v82 = document.createElement("div");
    v82.style.cssText = "\n          background: " + vO3.bg + ";\n          backdrop-filter: " + vO3.blur + ";\n          -webkit-backdrop-filter: " + vO3.blur + ";\n          width: 220px;\n          padding: 10px;\n          border-radius: 15px;\n          box-shadow: " + vO3.glow + ";\n          display: none;\n          flex-direction: column;\n          gap: 10px;\n          border: 0.5px solid " + vO3.border + ";\n          transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);\n          opacity: 0;\n          transform: translateY(10px) scale(0.95);\n          pointer-events: none;\n        ";
    const v83 = document.createElement("div");
    v83.style.cssText = "\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          padding-bottom: 10px;\n          margin-bottom: 10px;\n          border-bottom: 1px solid " + vO3.border + ";\n        ";
    const v84 = document.createElement("div");
    v84.innerHTML = "hackzinho";
    v84.style.cssText = "\n          font-weight: 700;\n          font-size: 18px;\n          color: " + vO3.accent + ";\n          text-shadow: " + vO3.glow + ";\n          letter-spacing: 2px;\n          text-transform: uppercase;\n        ";
    const v85 = document.createElement("div");
    v85.textContent = "✕";
    v85.style.cssText = "\n          color: " + vO3.text2 + ";\n          font-size: 16px;\n          cursor: pointer;\n          padding: 5px;\n          border-radius: 5px;\n          transition: all 0.2s ease;\n        ";
    v85.onmouseover = () => {
      v85.style.background = "rgba(255, 255, 255, 0.1)";
      v85.style.color = vO3.accent;
    };
    v85.onmouseout = () => {
      v85.style.background = "transparent";
      v85.style.color = vO3.text2;
    };
    v83.append(v84, v85);
    const v86 = document.createElement("div");
    v86.innerHTML = "\n          <div style=\"\n            display: grid; \n            grid-template-columns: auto 1fr; \n            gap: 4px 12px; \n            font-size: 12px; \n            color: " + vO3.text2 + ";\n            padding: 10px;\n            border-radius: 10px;\n            border: 0.5px solid " + vO3.border2 + ";\n          \">\n            <span style=\"color: " + vO3.accent + "; font-weight: bold; font-size: 14px;\">1:</span>\n            <span>Toggle Menu</span>\n            <span style=\"color: " + vO3.accent + "; font-weight: bold; font-size: 14px;\">2:</span>\n            <span>Execute R6</span>\n            <span style=\"color: " + vO3.accent + "; font-weight: bold; font-size: 14px;\">3:</span>\n            <span>Shutdown</span>\n          </div>\n        ";
    v82.append(v83, v86);
    v81.appendChild(v82);
    document.body.appendChild(v81);
    const v87 = document.createElement("div");
    v87.id = "r6-notifications-container";
    v87.style.cssText = "\n          position: fixed;\n          top: 20px;\n          right: 20px;\n          z-index: 2147483647;\n          display: flex;\n          flex-direction: column;\n          align-items: flex-end;\n          gap: 7px;\n        ";
    document.body.appendChild(v87);
    const vF14 = p31 => {
      const v88 = v82.style.opacity === "0";
      const v89 = p31 === undefined ? v88 : p31;
      if (v89) {
        v82.style.display = "flex";
        requestAnimationFrame(() => {
          v82.style.opacity = "1";
          v82.style.transform = "translateY(0) scale(1)";
          v82.style.pointerEvents = "auto";
        });
      } else {
        v82.style.opacity = "0";
        v82.style.transform = "translateY(10px) scale(0.95)";
        v82.style.pointerEvents = "none";
        setTimeout(() => {
          if (v82.style.opacity === "0") {
            v82.style.display = "none";
          }
        }, 300);
      }
    };
    v85.onclick = () => vF14(false);
    const vF15 = (p32, p33) => {
      const {
        answer = "Info",
        detail = "",
        type = "info"
      } = p32 || {};
      let v90 = vO3.accent;
      if (type === "success") {
        v90 = vO3.success;
      } else if (type === "error") {
        v90 = vO3.error;
      } else if (type === "warn") {
        v90 = vO3.warn;
      }
      const v91 = document.createElement("div");
      v91.style.cssText = "\n                background: " + vO3.notifBg + "; \n                backdrop-filter: " + vO3.blur + "; \n                -webkit-backdrop-filter: " + vO3.blur + "; \n                color: " + vO3.text + "; \n                padding: 15px 20px; \n                border-radius: 12px; \n                box-shadow: " + vO3.glow + "; \n                display: flex; \n                align-items: center; \n                gap: 15px; \n                max-width: 350px; \n                opacity: 0; \n                transform: translateX(20px) scale(0.95); \n                transition: all .3s cubic-bezier(0.25, 1, 0.5, 1); \n                border: 1px solid " + vO3.border + "; \n                border-left: 3px solid " + v90 + "; \n                cursor: pointer; \n                font-size: 14px;\n            ";
      v91.innerHTML = "<div><strong style=\"color:" + v90 + "; font-size: 15px;\">" + answer + "</strong> " + (detail ? "<span style=\"font-size:0.9em; color:" + vO3.text2 + "; display:block; margin-top: 5px;\">" + detail.replace(/</g, "&lt;") + "</span>" : "") + "</div>";
      let v92;
      const vF16 = () => {
        clearTimeout(v92);
        v91.style.opacity = "0";
        v91.style.transform = "translateX(20px) scale(0.95)";
        setTimeout(() => v91.remove(), 300);
      };
      v91.onclick = vF16;
      v87.appendChild(v91);
      requestAnimationFrame(() => {
        v91.style.opacity = "1";
        v91.style.transform = "translateX(0) scale(1)";
      });
      const v93 = p33 || (type === "error" || type === "warn" ? vO.NOTIFICATION_TIMEOUT_LONG : vO.NOTIFICATION_TIMEOUT_SHORT);
      v92 = setTimeout(vF16, v93);
    };
    return {
      helpers: {
        toggleMenu: vF14,
        showResponse: vF15
      }
    };
  }
  function f15() {
    vF("INFO", "hackzinho (v" + vLS8734 + ") Inicialized");
    try {
      vO2.ui = f14();
      vO2.ui.debugConsole = f13();
      if (!vO2.ui) {
        throw new Error("UI Initialization Failed.");
      }
      document.addEventListener("keydown", f10, true);
      vO2.ui.helpers.showResponse({
        answer: "hackzinho",
        type: "success"
      });
      vF("SUCCESS", "hackzinho Started Successfully");
      vF("INFO", "Press CTRL+9 to open Debug Console");
    } catch (e4) {
      vF("ERROR", "hackzinho Failure", e4);
      f9();
    }
  }
  async function f16() {
    await f11();
    f12();
  }
  f16();
})();
