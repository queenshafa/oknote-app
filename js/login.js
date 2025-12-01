const container = document.getElementById("loginContainer");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Logic Sign Up
const signUpForm = document.querySelector(".sign-up form");

signUpForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = signUpForm.querySelector('input[type="text"]').value;
  const email = signUpForm.querySelector('input[type="email"]').value;
  const password = signUpForm.querySelector('input[type="password"]').value;

  if (!name || !email || !password) {
    alert("Please fill all field.");
    return;
  }

  // Simpan ke localStorage (biar bisa dipakai login)
  const userData = {
    name,
    email,
    password,
  };

  localStorage.setItem("user", JSON.stringify(userData));

  alert("Registration Success! Please Login.");
  container.classList.remove("active"); // balik ke form login
});

// Logic Sign In
const signInForm = document.querySelector(".sign-in form");

signInForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = signInForm.querySelector('input[type="email"]').value;
  const password = signInForm.querySelector('input[type="password"]').value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("You have no account! Please create one first!");
    return;
  }

  if (email === user.email && password === user.password) {
    // redirect ke dashboard
    window.location.href = "dashboard.html";
  } else {
    alert("Email or password incorrect!");
  }
});
