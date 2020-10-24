const Aplication = {
  todos: [],

  save() {
    this.todos = [];

    document.querySelectorAll(".todo__item").forEach((element) => {
      let elementTodo = {
        id: parseInt(element.getAttribute("data-note-id")),
        note: element.querySelector(".text__area").textContent,
        checked: element.querySelector(".text__area").classList.value,
      };
      this.todos.push(elementTodo);
    });

    const json = JSON.stringify(this.todos);
    localStorage.setItem("todoCostas", json);

    document.querySelectorAll(".todo__item").forEach(ItemActions.dragAndDrop);

    return json;
  },

  load() {
    if (!localStorage.getItem("todoCostas")) {
      return;
    }

    const object = JSON.parse(localStorage.getItem("todoCostas"));

    for (item of object) {
      ItemActions.addItem(item.id, item.checked, item.note);
    }
  },
};

const ItemActions = {
  noteId: 1,
  addBtn: document.querySelector(".add__btn"),

  checkItem(element) {
    element.addEventListener("click", function () {
      element.parentNode.parentNode.firstElementChild.classList.toggle(
        "checked"
      );
      Aplication.save();
    });
  },

  deleteItem(element) {
    element.addEventListener("click", function () {
      element.parentNode.parentNode.classList.add("remove");
      setTimeout(() => {
        element.parentNode.parentNode.remove();
        Aplication.save();
      }, 200);
    });
  },

  editItem(element) {
    element.addEventListener("dblclick", function (event) {
      element.setAttribute("contenteditable", "true");
      element.focus();
      element.parentNode.removeAttribute("draggable");
    });

    element.addEventListener("blur", function (event) {
      element.removeAttribute("contenteditable");
      element.parentNode.setAttribute("draggable", "true");
      Aplication.save();

      if (!element.textContent.length) {
        element.parentNode.remove();
      }
    });
    Aplication.save();
  },

  addItem(noteId = null, noteClass = "text__area", noteText = "") {
    const outArea = document.querySelector("#out");

    const element = document.createElement("li");
    element.setAttribute("data-note-id", ItemActions.noteId);
    element.setAttribute("draggable", "true");
    element.classList.add("todo__item");

    ItemActions.noteId++;

    element.innerHTML = `
    <div class="${noteClass}">${noteText}</div>
    </form>
    <div class='events__btns'>
        <button class='check__btn'>
            <i class="fas fa-check"></i>
        </button>
        <button class='del__btn'>
            <i class="fas fa-trash"></i>
        </button>
    </div>
    `;

    outArea.appendChild(element);
    ItemActions.editItem(element.querySelector(".text__area"));

    element.firstElementChild.setAttribute("contenteditable", "true");
    element.firstElementChild.focus();

    ItemActions.deleteItem(element.querySelector(".del__btn"));
    ItemActions.checkItem(element.querySelector(".check__btn"));

    Aplication.save();
  },

  dragAndDrop() {
    let tasksListElement = document.querySelector("#out");

    tasksListElement.addEventListener(`dragstart`, (event) => {
      event.target.classList.add(`selected`);
    });
    tasksListElement.addEventListener(`dragend`, (event) => {
      event.target.classList.remove(`selected`);
    });

    const getNextElement = (cursorPosition, currentElement) => {
      const currentElementCoord = currentElement.getBoundingClientRect();
      const currentElementCenter =
        currentElementCoord.y + currentElementCoord.height / 2;
      const nextElement =
        cursorPosition < currentElementCenter
          ? currentElement
          : currentElement.nextElementSibling;
      return nextElement;
    };

    tasksListElement.addEventListener(`dragover`, (event) => {
      event.preventDefault();
      const activeElement = tasksListElement.querySelector(`.selected`);
      const currentElement = event.target;
      const isMoveable =
        activeElement !== currentElement &&
        currentElement.classList.contains(`todo__item`);
      if (!isMoveable) {
        return;
      }
      const nextElement = getNextElement(event.clientY, currentElement);
      if (
        (nextElement && activeElement === nextElement.previousElementSibling) ||
        activeElement === nextElement
      ) {
        return;
      }
      tasksListElement.insertBefore(activeElement, nextElement);

      Aplication.save();
    });
  },
};

document
  .querySelector(".add__btn")
  .addEventListener("click", ItemActions.addItem);
document.querySelectorAll(".text__area").forEach(ItemActions.editItem);
document.querySelectorAll(".check__btn").forEach(ItemActions.checkItem);
document.querySelectorAll(".del__btn").forEach(ItemActions.deleteItem);
document.querySelectorAll(".todo__item").forEach(ItemActions.dragAndDrop);

Aplication.load();
window.onload = document
  .querySelectorAll(".todo__item")
  .forEach(ItemActions.dragAndDrop);
