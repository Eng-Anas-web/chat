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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// ================= دالات التحقق (Validation Helpers) =================
function validateName(name) {
  return /^[a-zA-Z]+\s[a-zA-Z]+$/.test(name);
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return password.length >= 5 && password.length <= 10;
}

// ================= دالة التسجيل (Register) =================
function register(event) {
  event?.preventDefault();

  const loader = document.getElementById("loader"); // تعريف اللودر
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let registerAlert = document.getElementById("registerAlert");

  // تصفير الرسائل
  document.getElementById("nameAlert").textContent = "";
  document.getElementById("emailAlert").textContent = "";
  document.getElementById("passwordAlert").textContent = "";
  if (registerAlert) {
    registerAlert.textContent = "";
    registerAlert.className = "";
  }

  // 1. تحقق متسلسل
  if (!name) { document.getElementById("nameAlert").textContent = "Name is required"; return; }
  if (!validateName(name)) { document.getElementById("nameAlert").textContent = "Name must be First and Last name"; return; }
  if (!email) { document.getElementById("emailAlert").textContent = "Email is required"; return; }
  if (!validateEmail(email)) { document.getElementById("emailAlert").textContent = "Invalid email address"; return; }
  if (!password) { document.getElementById("passwordAlert").textContent = "Password is required"; return; }
  if (!validatePassword(password)) { document.getElementById("passwordAlert").textContent = "5-10 chars, letters & numbers only"; return; }

  // 2. إظهار الـ Loader فوراً عند بدء العملية
  loader.classList.remove("d-none");

  // 3. فحص الاسم في الداتا بيز
  db.collection("users")
    .where("name", "==", name)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        document.getElementById("nameAlert").textContent = "❌ This name is already registered";
        loader.classList.add("d-none"); // إخفاء في حالة وجود خطأ
        return;
      }

      // 4. إنشاء الحساب
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          return db
            .collection("users")
            .doc(userCredential.user.uid)
            .set({ name, email, uid: userCredential.user.uid });
        })
.then(() => {
  if (registerAlert) {
    registerAlert.classList.add("text-success");
    registerAlert.textContent = "✔ Account created successfully!";
  }

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";

  // ⬇️ استنى وبعدين اعمل redirect
  setTimeout(() => {
    window.location.href = "/chat/QuikChat/html/chat.html";
  }, 2000);
});
        .catch((error) => {
          if (error.code === "auth/email-already-in-use")
            document.getElementById("emailAlert").textContent = "❌ This email is already registered";
          else if (error.code === "auth/invalid-email")
            document.getElementById("emailAlert").textContent = "❌ Invalid email format";
          else {
            if (registerAlert) {
              registerAlert.classList.add("text-danger");
              registerAlert.textContent = "❌ " + error.message;
            }
          }
        })
        .finally(() => {
          // إخفاء الـ Loader في كل الأحوال (سواء نجح أو فشل)
          loader.classList.add("d-none");
        });
    });
}

// ================= دالة تسجيل الدخول (Login) =================
function login(event) {
  event?.preventDefault();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let alertBox = document.getElementById("loginAlert");

  if (!email || !password) {
    if (alertBox) alertBox.textContent = "Please fill all fields";
    return;
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "./html/chat.html";
    })
    .catch((error) => {
      if (alertBox) {
        alertBox.classList.add("text-danger");
        if (error.code === "auth/invalid-credential")
          alertBox.textContent = "❌ Invalid email or password.";
        else alertBox.textContent = "❌ Login error: " + error.message;
      }
    });
}

// ================= حماية الـ Event Listeners (تجنب الـ Null Error) =================
const regForm = document.getElementById("sumbitData"); // تأكد من الـ ID في الـ HTML
if (regForm) regForm.addEventListener("submit", register);

const logForm = document.getElementById("loginForm");
if (logForm) logForm.addEventListener("submit", login);

// تفعيل التحقق اللحظي للحقول (لو موجودة)
["name", "email", "password"].forEach((id) => {
  let input = document.getElementById(id);
  let alertBox = document.getElementById(id + "Alert");
  if (input && alertBox) {
    input.addEventListener("input", function () {
      alertBox.textContent = "";
    });
  }
});


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
