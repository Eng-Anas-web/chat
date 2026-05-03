
// ================= إعدادات فايربيس =================
const firebaseConfig = {
  apiKey: "AIzaSyAhXyi9bm8BU3-aIhgrI8UG7qYtDyL9akk",
  authDomain: "quick-chat-61362.firebaseapp.com",
  projectId: "quick-chat-61362",
  storageBucket: "quick-chat-61362.appspot.com",
  messagingSenderId: "277958482078",
  appId: "1:277958482078:web:bd3301c4885c94b4e0438f",
  measurementId: "G-PZGH22X5MD",
};

// تهيئة فايربيس
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

// ================= تسجيل الدخول =================
let loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let alertBox = document.getElementById("loginAlert");

    alertBox.textContent = "";

    if (email === "" || password === "") {
      alertBox.textContent = "Please enter your email and password.";
      return;
    }

    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {

        alertBox.classList.remove("text-danger");
        alertBox.classList.add("text-success");
        alertBox.textContent = "✔ Logged in successfully!";

        // تفريغ الحقول
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        // 👇 تأخير عشان الرسالة تظهر
        setTimeout(() => {
          alertBox.textContent = "";
          window.location.href = "/chat/QuikChat/html/chat.html";
        }, 1000);

      })
      .catch((error) => {

        alertBox.classList.remove("text-success");
        alertBox.classList.add("text-danger");

        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/invalid-login-credentials" ||
          error.message.includes("INVALID_LOGIN_CREDENTIALS")
        ) {
          alertBox.textContent =
            "The email or password is incorrect, or the account is not registered.";
        } else if (error.code === "auth/too-many-requests") {
          alertBox.textContent =
            "Too many failed login attempts, please try again later.";
        } else {
          alertBox.textContent =
            "An error occurred while logging in. Please make sure the information is correct.";
          console.error("Firebase Error: ", error);
        }
      });
  });
}

// ================= toggle password =================
function togglePassword() {
  let input = document.getElementById("password");
  let icon = document.getElementById("toggleEye");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// ================= render users =================
function renderUsers(usersList) {
  const usersContainer = document.getElementById("usersContainer");
  usersContainer.innerHTML = "";

  usersList.forEach((user) => {
    let userDiv = document.createElement("div");
    userDiv.className = "account-user mt-3";
    userDiv.setAttribute("data-id", user.id);

    userDiv.innerHTML = `
      <div class="d-flex align-items-center justify-content-start gap-2">
        <div class="profile d-flex align-items-center justify-content-center">
          <h6 class="text-white">
            ${user.name
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </h6>
        </div>
        <h5 class="fs-19px">${user.name}</h5>
      </div>
    `;

    usersContainer.appendChild(userDiv);
  });
}
