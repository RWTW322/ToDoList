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
// const modalForm = document.querySelector(".modal-wrapper");
const toDoList = document.querySelector(".toDolist");

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


let storedTodos = getTodoList();

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
    const checkboxContainer = document.createElement("label");
    const customCheckbox = document.createElement("span");
    const textContainer = document.createElement("div");
    checkboxContainer.classList.add("checkboxContainer");
    customCheckbox.classList.add("customCheckbox");
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
    checkboxContainer.appendChild(customCheckbox);
}

function renderTodos() {
    for (const todo of storedTodos) {
        createTodo(todo);
    }
}

function submitToDo(event) {
    event.preventDefault();

    const newTodo = {
        title: event.target.title.value,
        description: event.target.description.value,
        done: false,
        id: uniqueId(),
    };
    addTodoToLS(newTodo)
    createTodo(newTodo);
    storedTodos = getTodoList();
    const modalForm = document.querySelector(".modal-wrapper");
    document.body.removeChild(modalForm)
}

modalFormBtn.addEventListener("click", () => {
    const modalData = `
    
      <form class="modal-form">
        <h2 class="modal-form_title">ADD TODO</h2>
        <input type="text" name="title" class="modal-form_input-title" id="inputTitle" placeholder="Title" autofocus>
        <input type="text" name="description" class="modal-form_input-description" id="inputDescription" placeholder="Description">
        <button class="modal-form_input-submit button" id="submitBtn" type="submit">ADD</button>
      </form>
    
    `
    const wrapper = document.createElement('div')
    wrapper.classList.add('modal-wrapper')
    wrapper.innerHTML = modalData;
    document.body.appendChild(wrapper)
    document.getElementById('inputTitle').focus();
    const modalForm = document.querySelector(".modal-wrapper");
    modalForm.onsubmit = submitToDo
    // addBtn.addEventListener("click", submitToDo);
});

window.addEventListener("click", (event) => {
    const modalForm = document.querySelector(".modal-wrapper");
    if (event.target === modalForm) {
        
        document.body.removeChild(modalForm)
    }
});


renderTodos();