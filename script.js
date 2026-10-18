
const PROFILE = {
  name: "Rudy Listana Ibañez",
  phone: "+639179222976",
  email: "rudyibanezchess@gmail.com",
  facebook: "https://www.facebook.com/riches.chess.club",
  instagram: "https://www.instagram.com/rudyibanezchess",
  picture: "f/logo.png"
};

document.addEventListener("DOMContentLoaded", function () {
  const profilePicture = document.getElementById("profilePicture");
  const profileName = document.getElementById("profileName");
  const saveContactButton = document.getElementById("saveContact");
  const contactMessage = document.getElementById("contactMessage");

  const facebookLink = document.querySelector(".facebook-btn");
  const instagramLink = document.querySelector(".instagram-btn");
  const gmailLink = document.querySelector(".gmail-btn");
  const callLink = document.querySelector(".call-btn");

  if (profileName) {
    profileName.textContent = PROFILE.name;
  }

  if (profilePicture) {
    profilePicture.src = PROFILE.picture;
    profilePicture.alt = PROFILE.name + " profile picture";
  }

  if (facebookLink) {
    facebookLink.href = PROFILE.facebook;
    facebookLink.target = "_blank";
    facebookLink.rel = "noopener noreferrer";
  }

  if (instagramLink) {
    instagramLink.href = PROFILE.instagram;
    instagramLink.target = "_blank";
    instagramLink.rel = "noopener noreferrer";
  }

  if (gmailLink) {
    gmailLink.href =
      "https://mail.google.com/mail/?view=cm&fs=1&to=" +
      encodeURIComponent(PROFILE.email);
    gmailLink.target = "_blank";
    gmailLink.rel = "noopener noreferrer";
  }

  if (callLink) {
    callLink.href = "tel:" + PROFILE.phone;
  }

  if (saveContactButton) {
    saveContactButton.addEventListener("click", function () {
      function escapeVCard(value) {
        return String(value)
          .replace(/\\/g, "\\\\")
          .replace(/\r\n|\r|\n/g, "\\n")
          .replace(/,/g, "\\,")
          .replace(/;/g, "\\;");
      }

      const vCard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "FN:" + escapeVCard(PROFILE.name),
        "EMAIL:" + escapeVCard(PROFILE.email),
        "TEL;TYPE=CELL:" + escapeVCard(PROFILE.phone),
        "item1.URL:" + escapeVCard(PROFILE.facebook),
        "item1.X-ABLabel:Facebook",
        "item2.URL:" + escapeVCard(PROFILE.instagram),
        "item2.X-ABLabel:Instagram",
        "END:VCARD"
      ].join("\r\n") + "\r\n";

      const blob = new Blob([vCard], {
        type: "text/vcard;charset=utf-8"
      });

      const downloadURL = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");

      downloadLink.href = downloadURL;
      downloadLink.download = "Riches-Chess-Club-Contact.vcf";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      setTimeout(function () {
        URL.revokeObjectURL(downloadURL);
      }, 2000);

      if (contactMessage) {
        contactMessage.textContent =
          "Contact downloaded! Open the file to save it to your contacts.";
      }
    });
  }
});