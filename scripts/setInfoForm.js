const setInfo = function () {
  let formInfo = document.forms[1];
  let editBtn = formInfo.querySelector("button.edit");
  let formInfoElements = formInfo.elements;
  let divBtn = document.querySelectorAll("div.card");
  let popupInfo = document.querySelector("#popup-info");
  let closePopupInfo = popupInfo.querySelector("div.popup-close");
  let deleteBtn = formInfo.querySelector("button.delete");

  function editBtnPressed() {
    formInfo.addEventListener("submit", (e) => {
      e.preventDefault();
      let body = {};
      let id = formInfoElements.id.value;
      for (let i = 0; i < formInfoElements.length; i++) {
        let inp = formInfoElements[i];
        if (inp.type === "checkbox") {
          body[inp.name] = inp.checked;
        } else if (inp.name && inp.value) {
          if (inp.type === "number") {
            body[inp.name] = +inp.value;
          } else {
            body[inp.name] = inp.value;
          }
        }
      }
      api
        .updCat(id, body)
        .then((res) => res.json())
        .then((cat) => {
          if (cat.message === "ok") {
            let idNum = catsData.findIndex((x) => x.id === parseInt(id));
            catsData[idNum] = body;
            localStorage.setItem("cats", JSON.stringify(catsData));
            updCards(catsData);
          } else {
            console.log(cat);
          }
        });
    });
    if (formInfoElements.favourite.hasAttribute("disabled")) {
      for (let i = 0; i < formInfoElements.length; i++) {
        if (formInfoElements[i].name !== "id") {
          formInfoElements[i].removeAttribute("readonly");
          formInfoElements.favourite.removeAttribute("disabled");
        }
      }
      editBtn.innerText = "Сохранить";
    } else {
      for (let i = 0; i < formInfoElements.length; i++) {
        formInfoElements[i].setAttribute("readonly", true);
        formInfoElements.favourite.setAttribute("disabled", true);
      }
      editBtn.type = "submit";
      editBtn.innerText = "Редактировать";
    }
  }
  editBtn.onclick = editBtnPressed;

  function deleteBtnPressed() {
    alert("удалить кота?...точно...?");
    deleteBtn.innerText = "Точно!";

    deleteBtn.onclick = () => {
      deleteBtn.type = "submit";
      deleteBtn.innerText = "Удалён";
    };

    formInfo.addEventListener("submit", (e) => {
      e.preventDefault();
      let id = formInfoElements.id.value;
      api
        .delCat(id)
        .then((res) => res.json())
        .then((cat) => {
          if (cat.message === "ok") {
            let idNum = catsData.findIndex((x) => x.id === parseInt(id));
            if (idNum !== -1) {
              catsData = catsData
                .slice(0, idNum)
                .concat(catsData.slice(idNum + 1));
              localStorage.setItem("cats", JSON.stringify(catsData));
              updCards(catsData);
              deleteBtn.disabled = true;
            }
          } else {
            console.log(cat);
          }
        });
    });
  }
  deleteBtn.onclick = deleteBtnPressed;

  divBtn.forEach((e) => {
    let catId = e.id;
    e.addEventListener("click", (e) => {
      e.preventDefault();
      if (!popupInfo.classList.contains("active")) {
        popupInfo.classList.add("active");
        popupInfo.parentElement.classList.add("active");
        deleteBtn.disabled = false;
        let catLookup = catsData.filter((e) => {
          return e.id === parseInt(catId);
        });
        let curCat = catLookup[0];
        for (let i = 0; i < formInfoElements.length; i++) {
          let catVal = formInfoElements[i].name;
          if (catVal in curCat) {
            formInfoElements[i].value = curCat[catVal];
            formInfo.querySelector(
              ".form-img"
            ).style.background = `url("${curCat.img_link}") no-repeat center / cover`;
            curCat.favourite
              ? (formInfoElements.favourite.checked = true)
              : (formInfoElements.favourite.checked = false);
          }
        }
        let textarea = formInfo.querySelector("textarea");
        textarea.style.height = "";
        let scHeight = textarea.scrollHeight;
        textarea.style.height = `${scHeight}px`;

        closePopupInfo.addEventListener("click", () => {
          popupInfo.classList.remove("active");
          popupInfo.parentElement.classList.remove("active");
          textarea.style.height = "";
          deleteBtn.innerText = "Удалить";
          deleteBtn.type = "button";
        });
      }
    });
  });
};
