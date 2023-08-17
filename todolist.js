/**
 * @param TODOITEM
 * {
 *  title: string;
 *  description?: string;
 *  done: boolean;
 * }
 * 
 * @example
 * 
 * [
 *   {
 *      title: "Create todo list",
 *      done: false
 *   },
 *   {
 *      title: "123",
 *      description: ""
 *      done: true
 *   }
 * ]
 */

const modalFormBtn = document.querySelector(".modalFormBtn");
const modalForm = document.querySelector(".modal-wrapper");
const toDoList = document.querySelector(".toDolist");
const addBtn = document.querySelector("#submitBtn");
const inputTitle = document.querySelector(".modal-form_input-title");
const inputDescription = document.querySelector(".modal-form_input-description");

const storedItems = localStorage.getItem("TODOLIST");
if (!storedItems) {
    localStorage.setItem("TODOLIST", "[]")
}

const storedTodos = JSON.parse(localStorage.getItem("TODOLIST"));
let counterId = storedTodos.length > 1 ? storedTodos[storedTodos.length - 1].id + 1 : 1;

function createTodo(todo) {
    const listItem = document.createElement('li');
    const toDoTitle = document.createElement("h2");
    const toDoDescription = document.createElement("span");
    const checkboxContainer = document.createElement("div");
    const textContainer = document.createElement("div");
    
    toDoTitle.id = "title" + counterId;
    toDoDescription.id = 'description' + counterId;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = counterId;

    checkbox.classList.add("checkboxToDo");
    listItem.classList.add("toDo");
    toDoTitle.classList.add("toDoTitle");
    toDoDescription.classList.add("toDoDescription");

    toDoTitle.textContent = todo.title;
    toDoDescription.textContent = todo.description;

    toDoList.appendChild(listItem);
    listItem.appendChild(textContainer);
    listItem.appendChild(checkboxContainer);
    textContainer.appendChild(toDoTitle);
    textContainer.appendChild(toDoDescription);
    checkboxContainer.appendChild(checkbox);
}

function renderTodos() {
    for (const todo of storedTodos) {
        createTodo(todo);
    }
}

function submitToDo(event) {
    event.preventDefault();

    const titleValue = inputTitle.value;
    const descriptionValue = inputDescription.value;
    inputTitle.value = "";
    inputDescription.value = "";

    const newTodo = {
        title: titleValue,
        description: descriptionValue,
        done: false,
        id: counterId,
    };

    counterId++;

    storedTodos.push(newTodo);
    localStorage.setItem("TODOLIST", JSON.stringify(storedTodos));

    createTodo(newTodo);
    modalForm.style.display = "none";
}

modalFormBtn.addEventListener("click", () => {
    modalForm.style.display = "flex";
    addBtn.addEventListener("click", submitToDo);
});

window.addEventListener("click", (event) => {
    if (event.target === modalForm) {
        modalForm.style.display = "none";
    }
});

const clearBtn = document.querySelector(".clearToDos");

clearBtn.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
})

renderTodos();

const checkList = document.querySelectorAll('.checkboxToDo');

checkList.forEach(item => {
    item.addEventListener("click", (event) => {
        const check = event.target;

        let numId = Number(check.getAttribute("id"));
        const selectedToDo = storedTodos.find(todo => todo.id === numId);
        const checkedTitle = document.querySelector(`#title${numId}`);
        const checkedDescription = document.querySelector(`#description${numId}`);

        if (check.checked) {
            checkedTitle.style.textDecoration = "line-through";
            checkedDescription.style.textDecoration = "line-through";
            selectedToDo.done = true;
        } else {
            checkedTitle.style.textDecoration = "none";
            checkedDescription.style.textDecoration = "none";
            selectedToDo.done = false;
        }
    });
});

