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

/**
 * 
 * HELPERS
 */

const LS_KEY = "TODOLIST"

const getTodoList = () => {
    const list = localStorage.getItem(LS_KEY);
    if (!list) {
        localStorage.setItem(LS_KEY, "[]")
        return []
    }
    return JSON.parse(list)
}

const addTodoToLS = (todo) => {
    const list = getTodoList();
    localStorage.setItem(LS_KEY, JSON.stringify([...list, todo]))
}

const updateTodoInLS = (todo) => {
    const list = getTodoList().map(item=>{
        if(item.id === todo.id){
            return todo
        }
        return item;
    });
    localStorage.setItem(LS_KEY, JSON.stringify(list));
}



const createUniqueId = (lastId = 0) => {
    let last = lastId;
    return () => {
        last += 1;
        return last
    }
}


const storedTodos = getTodoList();

const uniqueId = createUniqueId(storedTodos[storedTodos.length - 1]?.id);


const changeTodoState = (event) => {
    const checkbox = event.target;
    const todo = document.querySelector(`#todo-item-${checkbox.id}`);
    const isChecked = event.target.checked;
    const updateTodo = storedTodos.find(todo=>todo.id === Number(checkbox.id))
    updateTodo.done = isChecked;
    updateTodoInLS(updateTodo);
    if(isChecked){
        todo.classList.add('checked')    
    }else{
        todo.classList.remove('checked')    
    }
}

function createTodo({ id, ...todo }) {
    const listItem = document.createElement('li');
    const toDoTitle = document.createElement("h2");
    const toDoDescription = document.createElement("span");
    const checkboxContainer = document.createElement("div");
    const textContainer = document.createElement("div");
    listItem.id = `todo-item-${id}`;
    toDoTitle.id = "title" + id;
    toDoDescription.id = 'description' + id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id;
    checkbox.checked = todo.done;

    if(todo.done){
        listItem.classList.add('checked')
    }

    checkbox.classList.add("checkboxToDo");
    checkbox.onchange = changeTodoState;
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
        id: uniqueId(),
    };
    addTodoToLS(newTodo)
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


renderTodos();