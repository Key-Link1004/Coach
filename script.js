
const PROFILE = {
  name: "Rudy Listana Ibanez",
  phone: "+639179222976",
  email: "rudyibanezchess@gmail.com",
  organization: "Chess Enthusiast",
  facebook: "https://www.facebook.com/riches.chess.club",
  instagram: "https://www.instagram.com/rudyibanezchess"
};

const PASSWORD = "RICHESS";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DB_NAME = "ChessProfileDB";
const STORE_NAME = "images";
const IMAGE_KEY = "profilePicture";

const imageInput = document.getElementById("imageInput");
const profilePicture = document.getElementById("profilePicture");
const uploadLabel = document.getElementById("uploadLabel");
const uploadMessage = document.getElementById("uploadMessage");

const passwordModal = document.getElementById("passwordModal");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");
const togglePassword = document.getElementById("togglePassword");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

const saveContactButton = document.getElementById("saveContact");
const contactMessage = document.getElementById("contactMessage");

let db;
let authorized = false;
let imageLoadRequest = 0;

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB is not supported in this browser."));
      return;
    }

    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = function (event) {
      const database = event.target.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = function () {
      db = request.result;

      db.onversionchange = function () {
        db.close();
      };

      resolve(db);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}

function getSavedImage() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(IMAGE_KEY);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

function saveImage(blob) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).put(blob, IMAGE_KEY);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function displayImage(blob) {
  if (!blob) return;

  const requestId = ++imageLoadRequest;
  const reader = new FileReader();

  reader.onload = function () {
    if (requestId === imageLoadRequest) {
      profilePicture.src = reader.result;
    }
  };

  reader.onerror = function () {
    showUploadMessage("Unable to display the saved image.", true);
  };

  reader.readAsDataURL(blob);
}

function showUploadMessage(message, isError = false) {
  if (!uploadMessage) return;

  uploadMessage.textContent = message;
  uploadMessage.classList.toggle("error", isError);
}

function openPasswordModal() {
  if (!passwordModal) return;

  passwordError.textContent = "";
  passwordInput.value = "";
  passwordModal.classList.add("active");
  passwordModal.setAttribute("aria-hidden", "false");
  passwordInput.focus();
}

function closePasswordModal() {
  if (!passwordModal) return;

  passwordModal.classList.remove("active");
  passwordModal.setAttribute("aria-hidden", "true");
  passwordError.textContent = "";
  passwordInput.value = "";
}

function resetUploadAuthorization() {
  authorized = false;

  if (imageInput) {
    imageInput.disabled = true;
    imageInput.value = "";
  }
}

if (uploadLabel && imageInput) {
  uploadLabel.addEventListener("click", function (event) {
    event.preventDefault();

    if (authorized) {
      imageInput.click();
    } else {
      openPasswordModal();
    }
  });

  imageInput.addEventListener("change", async function () {
    const file = imageInput.files && imageInput.files[0];

    if (!file) {
      resetUploadAuthorization();
      return;
    }

    if (!file.type.startsWith("image/")) {
      showUploadMessage("Please select a valid image.", true);
      resetUploadAuthorization();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showUploadMessage("Please select an image smaller than 5 MB.", true);
      resetUploadAuthorization();
      return;
    }

    try {
      await saveImage(file);
      displayImage(file);
      showUploadMessage("Profile picture updated successfully.");
    } catch (error) {
      console.error("Image saving failed:", error);
      showUploadMessage(
        "Unable to save the image. Please try again.",
        true
      );
    } finally {
      resetUploadAuthorization();
    }
  });
}

if (passwordForm) {
  passwordForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (passwordInput.value === PASSWORD) {
      authorized = true;
      closePasswordModal();

      if (imageInput) {
        imageInput.disabled = false;
        imageInput.click();
      }
    } else {
      passwordError.textContent = "Incorrect password. Please try again.";
      passwordInput.select();
    }
  });
}

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Hide" : "Show";
  });
}

if (closeModal) {
  closeModal.addEventListener("click", closePasswordModal);
}

if (cancelModal) {
  cancelModal.addEventListener("click", closePasswordModal);
}

if (passwordModal) {
  passwordModal.addEventListener("click", function (event) {
    if (event.target === passwordModal) {
      closePasswordModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && passwordModal.classList.contains("active")) {
      closePasswordModal();
    }
  });
}

function configureSocialLinks() {
  document.querySelectorAll("a.social-btn").forEach((link) => {
    const label = link.textContent.trim().toLowerCase();

    if (label.includes("facebook")) {
      link.href = PROFILE.facebook;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    if (label.includes("instagram")) {
      link.href = PROFILE.instagram;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    if (label.includes("gmail") || link.href.includes("mail.google.com")) {
      link.href =
        "https://mail.google.com/mail/?view=cm&fs=1&to=" +
        encodeURIComponent(PROFILE.email);

      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    if (link.href.startsWith("tel:") || label.includes("call")) {
      link.href = "tel:" + PROFILE.phone;
    }
  });
}

function saveContact() {
  const escapeVCard = (value) =>
    String(value)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");

  const vCard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(PROFILE.name)}`,
    `ORG:${escapeVCard(PROFILE.organization)}`,
    `TEL;TYPE=CELL:${PROFILE.phone}`,
    `EMAIL:${PROFILE.email}`,
    `URL:${PROFILE.facebook}`,
    `URL:${PROFILE.instagram}`,
    "END:VCARD"
  ].join("\r\n");

  const blob = new Blob([vCard], {
    type: "text/vcard;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.href = url;
  downloadLink.download = "Riches-Chess-Club-Contact.vcf";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  if (contactMessage) {
    contactMessage.textContent =
      "Contact downloaded. Open the .vcf file to save it to your contacts.";
  }
}

if (saveContactButton) {
  saveContactButton.addEventListener("click", saveContact);
}

async function initializeProfile() {
  configureSocialLinks();

  if (imageInput) {
    imageInput.disabled = true;
  }

  try {
    await openDatabase();

    const savedImage = await getSavedImage();

    if (savedImage) {
      displayImage(savedImage);
    }
  } catch (error) {
    console.error("Profile initialization failed:", error);
    showUploadMessage(
      "Browser storage is unavailable. Your picture may not persist.",
      true
    );
  }
}

initializeProfile();
