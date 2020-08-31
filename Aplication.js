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
      return json;
    },
    load() {
      if (!localStorage.getItem("todoCostas")) {
        return;
      }
  
      const object = JSON.parse(localStorage.getItem("todoCostas"));
  
      const outArea = document.querySelector("#out");
  
      for (item of object) {
        const element = document.createElement("li");
        element.setAttribute("data-note-id", item.id);
        element.setAttribute("draggable", "true");
        element.classList.add("todo__item");
  
        noteId++;
  
        element.innerHTML = `
        <div class='${item.checked}'>${item.note}</div>
        <div class='events__btns'>
            <button class='check__btn'>
                <i class="fas fa-check"></i>
            </button>
            <button class='del__btn'>
                <i class="fas fa-trash"></i>
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
      }
    },
  };