// ================= دوال التشفير (Caesar Cipher) =================
const SHIFT = 3;

function caesarEncrypt(text) {
  return text
    .split("")
    .map((char) => {
      let code = char.charCodeAt(0);
      if (code >= 65 && code <= 90)
        return String.fromCharCode(((code - 65 + SHIFT) % 26) + 65);
      if (code >= 97 && code <= 122)
        return String.fromCharCode(((code - 97 + SHIFT) % 26) + 97);
      return char;
    })
    .join("");
}

function caesarDecrypt(text) {
  return text
    .split("")
    .map((char) => {
      let code = char.charCodeAt(0);
      if (code >= 65 && code <= 90)
        return String.fromCharCode(((code - 65 - SHIFT + 26) % 26) + 65);
      if (code >= 97 && code <= 122)
        return String.fromCharCode(((code - 97 - SHIFT + 26) % 26) + 97);
      return char;
    })
    .join("");
}

// ================= تشغيل الكود عند تحميل الصفحة =================
document.addEventListener("DOMContentLoaded", () => {
  const usersContainer = document.getElementById("usersContainer");
  const searchInput = document.getElementById("searchByUserName");
  const noUsersDiv = document.querySelector(".not-user");

  // 1. السيرش
if (searchInput) {
  const notFoundDiv = document.querySelector(".not-found");

  searchInput.addEventListener("input", (e) => {
    const searchText = e.target.value.toLowerCase();
    let found = false;

    document.querySelectorAll(".account-user").forEach((card) => {
      const name = card.querySelector("h5").innerText.toLowerCase();

      if (name.includes(searchText)) {
        card.style.display = "";
        found = true;
      } else {
        card.style.display = "none";
      }
    });

    // 👇 اظهار او اخفاء الرسالة
    if (notFoundDiv) {
      notFoundDiv.classList.toggle("d-none", found || searchText === "");
    }
  });
}

  // 2. الضغط على اليوزر
  if (usersContainer) {
    usersContainer.addEventListener("click", (e) => {
      const userCard = e.target.closest(".account-user");
      if (userCard) {
        openChat(userCard.getAttribute("data-id"));
      }
    });
  }

  // 3. جلب اليوزرات
  if (auth) {
    auth.onAuthStateChanged((user) => {
      if (user) {
db.collection("users").doc(user.uid)
  .onSnapshot((doc) => {
    if (!doc.exists) {
      auth.signOut().then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../index.html";
      });
    }
  });
        // 🔴 FORCE LOGOUT (لو الحساب اتحذف)
        db.collection("users").doc(user.uid)
          .onSnapshot((doc) => {
            if (!doc.exists) {
              auth.signOut().then(() => {
                alert("تم حذف حسابك من النظام");
                window.location.reload();
              });
            }
          });

        // Online status
        db.collection("users").doc(user.uid).update({ status: "online" });

        window.addEventListener("beforeunload", () => {
          db.collection("users").doc(user.uid).update({ status: "offline" });
        });

        db.collection("users").onSnapshot((snapshot) => {
          usersContainer.innerHTML = "";

          let hasUsers = false;

          snapshot.forEach((doc) => {
            let u = doc.data();

            if (u.uid !== user.uid) {
              hasUsers = true;

              let chatId =
                user.uid < u.uid
                  ? user.uid + "_" + u.uid
                  : u.uid + "_" + user.uid;

              let statusColor =
                u.status === "online" ? "bg-success" : "bg-secondary";

              let userDiv = document.createElement("div");
              userDiv.className = "account-user mt-3 position-relative";
              userDiv.setAttribute("data-id", u.uid);

              userDiv.innerHTML = `
                <div class="d-flex align-items-center justify-content-start gap-2">
                  <div class="profile d-flex align-items-center justify-content-center" style="position: relative;">
                    <h6 class="text-white">${u.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}</h6>
                    <div class="${statusColor}" style="width:10px;height:10px;border-radius:50%;position:absolute;bottom:0;right:0;border:2px solid white;"></div>
                  </div>
                  <h5 class="fs-19px">${u.name}</h5>
                  <span class="unread-badge bg-info text-white rounded-circle px-2 d-none" style="font-size:10px;margin-left:auto;">0</span>
                </div>`;

              usersContainer.appendChild(userDiv);

              db.collection("chats")
                .doc(chatId)
                .collection("messages")
                .where("senderId", "==", u.uid)
                .where("read", "==", false)
                .onSnapshot((msgSnap) => {
                  let badge = userDiv.querySelector(".unread-badge");
                  if (msgSnap.size > 0) {
                    badge.innerText = msgSnap.size;
                    badge.classList.remove("d-none");
                  } else {
                    badge.classList.add("d-none");
                  }
                });
            }
          });

          // NO USERS
          if (noUsersDiv) {
            noUsersDiv.classList.toggle("d-none", hasUsers);
          }
        });
      }
    });
  }
});

// ================= الدوال الأساسية =================
function openChat(userId) {
  const clickShowChat = document.querySelector(".chat");
  const usersList = document.querySelector(".users");

  clickShowChat.classList.remove("d-none");
  usersList.classList.add("d-none");

  const myUid = auth.currentUser.uid;
  const chatId = myUid < userId ? myUid + "_" + userId : userId + "_" + myUid;

  db.collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      let user = doc.data();

      document.getElementById("chat").innerHTML = `
        <div>
          <div class="p-15px">
            <div class="back d-md-none" onclick="hiddenChat()">
              <a href="#" class="nav-link">
                <i class="fa-solid fa-arrow-left-long"></i> الرجوع
              </a>
            </div>

            <div class="d-flex align-items-center justify-content-start gap-2 akjd">
              <div class="profile d-flex align-items-center justify-content-center">
                <h6 class="text-white">${user.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}</h6>
              </div>
              <h5 class="fs-19px">${user.name}</h5>
            </div>
          </div>

          <div class="background-chat d-flex flex-column gap-2 pb-3" id="messageContainer" style="height:400px;overflow-y:auto;"></div>

          <div class="send-message pt-2 d-flex align-items-center gap-2 pe-2 p-15px mb-2">
            <textarea class="form-control" id="messageInput"></textarea>
            <div class="icon-message d-flex align-items-center justify-content-center"
              onclick="sendMessage('${userId}', '${chatId}')"
              style="cursor:pointer;">
              <i class="fa-solid fa-paper-plane text-white"></i>
            </div>
          </div>
        </div>`;

      loadMessages(chatId);

      db.collection("chats")
        .doc(chatId)
        .collection("messages")
        .where("senderId", "==", userId)
        .where("read", "==", false)
        .get()
        .then((snap) =>
          snap.forEach((doc) => doc.ref.update({ read: true }))
        );
    });
}

function sendMessage(receiverId, chatId) {
  const input = document.getElementById("messageInput");

  if (input.value.trim() !== "") {
    db.collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({
        senderId: auth.currentUser.uid,
        text: caesarEncrypt(input.value.trim()),
        read: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => (input.value = ""));
  }
}

function loadMessages(chatId) {
  const container = document.getElementById("messageContainer");

  db.collection("chats")
    .doc(chatId)
    .collection("messages")
    .orderBy("createdAt", "asc")
    .onSnapshot((snap) => {
      container.innerHTML = "";

      snap.forEach((doc) => {
        let msg = doc.data();
        let isMyMsg = msg.senderId === auth.currentUser.uid;

        let time = msg.createdAt
          ? msg.createdAt
              .toDate()
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "";

        container.innerHTML += `
          <div class="${
            isMyMsg ? "messages-me align-self-end me-3" : "messages-you"
          }">
            <p class="text-white">${caesarDecrypt(msg.text)}</p>
            <p class="text-white-50 fs-12px">${time}</p>
          </div>`;
      });

      container.scrollTop = container.scrollHeight;
    });
}

function hiddenChat() {
  document.querySelector(".chat").classList.add("d-none");
  document.querySelector(".users").classList.remove("d-none");
}
