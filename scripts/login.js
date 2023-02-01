let formLog = document.forms[2];
let logBtn = document.querySelector("#login");
let popupLog = document.querySelector("#popup-login");
let closePopupLog = popupLog.querySelector(".popup-close");

console.log(document.cookie);
logBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!popupLog.classList.contains("active")) {
    popupLog.classList.add("active");
    popupLog.parentElement.classList.add("active");
  }
  if (document.cookie !== "") {
    let nameValue = document.cookie.replace(
      /(?:(?:^|.*;\s*)name\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    let pasValue = document.cookie.replace(
      /(?:(?:^|.*;\s*)password\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    formLog.innerHTML = `<p>Привет ${nameValue}, твой пароль - ${pasValue}!</p>`;
  } else {
    formLog.addEventListener("submit", (e) => {
      e.preventDefault();
      for (let i = 0; i < formLog.elements.length; i++) {
        let inp = formLog.elements[i];
        if (inp.type !== "submit") {
          document.cookie = `${inp.name}=${inp.value}`;
        }
      }
      closePopupLog.click();
    });
  }
});
closePopupLog.addEventListener("click", () => {
  popupLog.classList.remove("active");
  popupLog.parentElement.classList.remove("active");
});

