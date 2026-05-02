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

// تهيئة فايربيس في هذا الملف
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// 👇 السطر ده هو اللي هيحل المشكلة (تعريف الـ auth)
const auth = firebase.auth();

// ================= كود تسجيل الدخول (اللي إنت ضفته) =================
let loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // ... باقي الكود بتاعك زي ما هو بالظبط
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let alertBox = document.getElementById("loginAlert");

    alertBox.textContent = "";

    if (email === "" || password === "") {
      alertBox.textContent = " Please enter your email and password.";
      return;
    }

    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alertBox.classList.remove("text-danger");
        alertBox.classList.add("text-success");
        alertBox.textContent = "✔ Logged in successfully! Redirecting...";
        // 👇 السطور الجديدة لتفريغ الحقول فوراً بعد النجاح
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        window.location.href = "../html/chat.html"; // تأكد من مسار واسم صفحة الشات
      })
      .catch((error) => {
        alertBox.classList.remove("text-success");
        alertBox.classList.add("text-danger");

        // 👇 ضفنا هنا التحديث الجديد بتاع فايربيس
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
          // لو في خطأ تاني خالص، نعرضه بشكل أبسط
          alertBox.textContent =
            "An error occurred while logging in. Please make sure the information is correct.";
          console.error("Firebase Error: ", error);
        }
      });
  });
}

function togglePassword() {
  let input = document.getElementById("password");
  let icon = document.getElementById("toggleEye");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash"); // 👁️ مغلقة
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye"); // 👁️ مفتوحة
  }
}

function renderUsers(usersList) {
  const usersContainer = document.getElementById("usersContainer");
  usersContainer.innerHTML = ""; // نمسح أي حاجة قديمة

  usersList.forEach((user) => {
    // 1. بناء العنصر الأب بنفس الكلاس
    let userDiv = document.createElement("div");
    userDiv.className = "account-user mt-3"; // الستايل بتاعك هنا!
    userDiv.setAttribute("data-id", user.id);

    // 2. بناء المحتوى الداخلي بنفس الترتيب
    userDiv.innerHTML = `
      <div class="d-flex align-items-center justify-content-start gap-2">
        <div class="profile d-flex align-items-center justify-content-center">
          <h6 class="text-white d-flex align-items-center justify-content-center">
            ${user.name
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </h6>
        </div>
        <h5 class="fs-19px">${user.name}</h5>
      </div>
    `;

    // 3. إضافة العنصر للحاوية
    usersContainer.appendChild(userDiv);
  });
}
