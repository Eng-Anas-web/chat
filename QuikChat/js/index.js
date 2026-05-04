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


// ================= Validation =================
function validateName(name) {
  return /^[a-zA-Z]+\s[a-zA-Z]+$/.test(name);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return /^[a-zA-Z0-9]{5,10}$/.test(password);
}


// ================= Register =================
function register(event) {
  event?.preventDefault();

  const loader = document.getElementById("loader");

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let registerAlert = document.getElementById("registerAlert");

  // reset alerts
  document.getElementById("nameAlert").textContent = "";
  document.getElementById("emailAlert").textContent = "";
  document.getElementById("passwordAlert").textContent = "";

  if (registerAlert) {
    registerAlert.textContent = "";
    registerAlert.className = "";
  }

  // validation
  if (!name) return (document.getElementById("nameAlert").textContent = "Name is required");
  if (!validateName(name)) return (document.getElementById("nameAlert").textContent = "First and Last name required");

  if (!email) return (document.getElementById("emailAlert").textContent = "Email is required");
  if (!validateEmail(email)) return (document.getElementById("emailAlert").textContent = "Invalid email");

  if (!password) return (document.getElementById("passwordAlert").textContent = "Password is required");
  if (!validatePassword(password)) return (document.getElementById("passwordAlert").textContent = "5-10 letters & numbers");

  loader.classList.remove("d-none");

  db.collection("users")
    .where("name", "==", name)
    .get()
    .then((querySnapshot) => {

      if (!querySnapshot.empty) {
        document.getElementById("nameAlert").textContent = "❌ This name is already registered";
        loader.classList.add("d-none");
        throw new Error("Name exists");
      }

      return auth.createUserWithEmailAndPassword(email, password);
    })
    .then((userCredential) => {
      return db.collection("users").doc(userCredential.user.uid).set({
        name,
        email,
        uid: userCredential.user.uid
      });
    })
    .then(() => {
      if (registerAlert) {
        registerAlert.classList.add("text-success");
        registerAlert.textContent = "✔ Account created successfully!";
      }

      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";

      // redirect (صح 100%)
      setTimeout(() => {
        window.location.href = "QuikChat/html/chat.html";
      }, 1200);
    })
    .catch((error) => {
      if (error.message !== "Name exists") {
        if (registerAlert) {
          registerAlert.classList.add("text-danger");
          registerAlert.textContent = "❌ " + error.message;
        }
      }
    })
    .finally(() => {
      loader.classList.add("d-none");
    });
}


// ================= Login =================
function login(event) {
  event?.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let alertBox = document.getElementById("loginAlert");

  if (!email || !password) {
    if (alertBox) alertBox.textContent = "Please fill all fields";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "QuikChat/html/chat.html";
    })
    .catch((error) => {
      if (alertBox) {
        alertBox.classList.add("text-danger");
        alertBox.textContent = "❌ " + error.message;
      }
    });
}


// ================= Events =================
const regForm = document.getElementById("sumbitData");
if (regForm) regForm.addEventListener("submit", register);

const logForm = document.getElementById("loginForm");
if (logForm) logForm.addEventListener("submit", login);


// ================= Live input reset =================
["name", "email", "password"].forEach((id) => {
  let input = document.getElementById(id);
  let alertBox = document.getElementById(id + "Alert");

  if (input && alertBox) {
    input.addEventListener("input", () => {
      alertBox.textContent = "";
    });
  }
});


// ================= Password toggle =================
function togglePassword() {
  let input = document.getElementById("password");
  let icon = document.getElementById("toggleEye");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}
