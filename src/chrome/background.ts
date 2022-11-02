const ua = window.navigator.userAgent;

chrome.runtime.onInstalled.addListener(() => {
  console.log("'Create React Web Extension - TypeScript' installed/updated...");
});

chrome.runtime.onMessageExternal.addListener(function (
  request,
  sender,
  sendResponse
) {
  const { authed, user } = request;
  if (user && authed) {
    chrome.storage.local.set({ user }, async function () {
      sendResponse("success");
    });
  }
  if (!authed) {
    chrome.storage.local.clear(() => {
      sendResponse("removed");
    });
  }
});

// remove if tab is firefox pdf in local storage
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`isFirefoxPdf-${tabId}`);
});

if (/Firefox/i.test(ua)) {
  chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
      // Proxy login is a POST method that gets redirected to the final destination via a 302
      if (
        details.method !== "GET" &&
        details.statusCode < 300 &&
        details.statusCode >= 400
      )
        return;

      const contentType = details.responseHeaders?.filter(
        (object) => object.name.toLowerCase() === "content-type"
      )[0].value;

      if (!contentType) return;
      if (
        !contentType.includes("application/pdf") &&
        !contentType.includes("application/octet-stream")
      )
        return;

      // While Firefox will show the PDF viewer for application/octet-stream, it must pass some
      // additional checks: the URL must end in .pdf and the PDF must be a top-level document.
      // https://searchfox.org/mozilla-central/rev/50c3cf7a3c931409b54efa009795b69c19383541/toolkit/components/pdfjs/content/PdfStreamConverter.jsm#1100-1121
      if (contentType.includes("application/octet-stream")) {
        if (!details.url.includes(".pdf") || !(details.type === "main_frame"))
          return;
      }

      // Somehow browser.webNavigation.onCommitted runs later than headersReceived
      setTimeout(async function () {
        chrome.storage.local.set(
          { [`isFirefoxPdf-${details.tabId}`]: true },
          async function () {
            console.log("background saved firefox pdf state");
          }
        );
      }, 100);
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
  );
}

export {};
