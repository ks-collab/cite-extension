import convertBlobToBase64 from "utils/convertBlobToBase64";
import { ChromeMessage, Sender } from "../types";

console.log("content script installed");

// listerner for sending auth info from Synapse to the Firefox add-on
const ua = window.navigator.userAgent;

// use window.postMessage to send auth info from Synapse to the Firefox and Safari add-on
if (!/Chrome/i.test(ua)) {
  window.addEventListener("message", (event) => {
    if (event.source === window) {
      const { authed, user } = event.data;
      if (user && authed) {
        chrome.storage.local.set({ user });
      }
      if (authed !== undefined && !authed) {
        chrome.storage.local.clear();
      }
    }
  });
}

const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: any,
  response: any
) => {
  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.React &&
    message.action === "detect pdf"
  ) {
    const embedded = document.querySelectorAll("embed")[0];
    if (embedded && embedded.type === "application/pdf") {
      response("pdf");
    } else {
      response("html");
    }
  }

  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.React &&
    message.action === "open url"
  ) {
    window.open(message.payload);
  }

  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.React &&
    message.action === "synapse login"
  ) {
    window.open(message.payload, "_blank")?.focus();
    response(true);
  }
};

const generateSavePageResponse = async () => {
  const before = Date.now();
  console.log("start time:", before);
  // @ts-ignore
  const pageData = await extension.getPageData({
    removeHiddenElements: true,
    removeUnusedStyles: true,
    removeUnusedFonts: true,
    removeImports: true,
    removeScripts: true,
    compressHTML: true,
    removeAudioSrc: true,
    removeVideoSrc: true,
    removeAlternativeFonts: true,
    removeAlternativeMedias: true,
    removeAlternativeImages: true,
    groupDuplicateImages: true,
  });

  const { content, title } = pageData;
  const contentBlob = new Blob([content], { type: "text/html" });

  let base64String, blobUrl;

  if (/Firefox/i.test(ua) || /Safari/i.test(ua)) {
    base64String = await convertBlobToBase64(contentBlob);
  } else {
    blobUrl = URL.createObjectURL(contentBlob);
  }

  return {
    action: "send html from content",
    payload: {
      base64String,
      blobUrl,
      filename: title,
    },
  };
};

const uploadListener = (message: ChromeMessage, sender: any, response: any) => {
  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.React &&
    message.action === "upload pdf"
  ) {
    // load current file from "cache"
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "", true);
    xhr.responseType = "blob";
    xhr.onload = async (event: any) => {
      const { currentTarget } = event;
      if (currentTarget.status === 200) {
        const file = currentTarget.response;
        const filename = window.location.href.split("/").pop();
        const base64String = await convertBlobToBase64(file);
        response({
          action: "send pdf from content",
          payload: {
            base64String,
            filename,
          },
        });
      } else {
        response({
          action: "error",
          payload: {
            message: "Failed to prepare the file",
          },
        });
      }
    };
    xhr.send();
    return true;
  }
  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.React &&
    message.action === "capture web"
  ) {
    generateSavePageResponse().then((result) => response(result));
    return true;
  }
  return true;
};

chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
chrome.runtime.onMessage.addListener(uploadListener);
