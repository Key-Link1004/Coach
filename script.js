
const PROFILE = {
  name: "RICHES",
  phone: "+639179222976",
  email: "rudyibanezchess@gmail.com",
  organization: "Riches Chess Club",
  facebook: "https://www.facebook.com/riches.chess.club",
  instagram: "https://www.instagram.com/rudyibanezchess",
  picture: "f/logo.png"
};

document.addEventListener("DOMContentLoaded", function () {
  const profilePicture = document.getElementById("profilePicture");
  const profileName = document.getElementById("profileName");
  const saveContactButton = document.getElementById("saveContact");
  const contactMessage = document.getElementById("contactMessage");

  // Set the profile name and picture
  if (profileName) {
    profileName.textContent = PROFILE.name;
  }

  if (profilePicture) {
    profilePicture.src = PROFILE.picture;
    profilePicture.alt = PROFILE.name + " profile picture";

    profilePicture.addEventListener("error", function () {
      console.error(
        "Unable to load profile picture. Check this path:",
        PROFILE.picture
      );
    });
  }

  // Set social and contact links
  const facebookLink = document.querySelector(".facebook-btn");
  const instagramLink = document.querySelector(".instagram-btn");
  const gmailLink = document.querySelector(".gmail-btn");
  const callLink = document.querySelector(".call-btn");

  if (facebookLink) {
    facebookLink.href = PROFILE.facebook;
  }

  if (instagramLink) {
    instagramLink.href = PROFILE.instagram;
  }

  if (gmailLink) {
    gmailLink.href =
      "https://mail.google.com/mail/?view=cm&fs=1&to=" +
      encodeURIComponent(PROFILE.email);
  }

  if (callLink) {
    callLink.href = "tel:" + PROFILE.phone;
  }

  // Generate a contact file for importing into a phone
  if (saveContactButton) {
    saveContactButton.addEventListener("click", function () {
      function escapeVCard(value) {
        return String(value)
          .replace(/\\/g, "\\\\")
          .replace(/\n/g, "\\n")
          .replace(/,/g, "\\,")
          .replace(/;/g, "\\;");
      }

      const vCard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "FN:" + escapeVCard(PROFILE.name),
        "EMAIL:" + PROFILE.email,
        "URL:" + PROFILE.facebook,
        "URL:" + PROFILE.instagram,
        "END:VCARD"
      ].join("\r\n");

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
      }, 1000);

      if (contactMessage) {
        contactMessage.textContent =
          "Contact downloaded. Open the file to save it to your phone contacts.";
      }
    });
  }
});
