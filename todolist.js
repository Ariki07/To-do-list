// STORING ALL REQUIERD ELEMENTS 
const taskInput = document.querySelector(".task-input input");
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");
const addBtn = document.querySelector(".task-input button");
const taskBox = document.querySelector(".task-box");

let editId;
let isEditTask = false;

// ARRAY TO STORE TODO ITEMS IN LOCAL STORAGE 
let todos = JSON.parse(localStorage.getItem("todo-list"));

// INPUT BOX FUNCTION
taskInput.onkeyup = ()=>{
    let userEnteredValue = taskInput.value;
    if(userEnteredValue.trim() != 0){
      addBtn.classList.add("active");
    }else{
      addBtn.classList.remove("active");
    }
  }

// FILTER OPTION RESULTS 
filters.forEach (btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

// FUNCTION TO SHOW TASKS BASED ON FILTERS
function showTodo(filter) {
    let liTag = "";
    if(todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>

                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span> No Tasks left </span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

// FUNCTION FOR UPDATING STATUS 
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

// FUNCTION FOR EDITING TASKS 
function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

// FUNCTION FOR DELETING TASKS 
function deleteTask(deleteId, filter) {
    const pendingTasksNumb = document.querySelector(".pendingTasks");
    pendingTasksNumb.textContent = (todos.length)-1;
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

// WHEN CLICKED CLEAR ALL BUTTON
clearAll.addEventListener("click", () => {
    todos = [];
    const pendingTasksNumb = document.querySelector(".pendingTasks");
    pendingTasksNumb.textContent = todos.length;
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
});

// FUNCTION TO ADD ANY TASK INTO STORAGE
function addTodolist (){
    document.getElementById("taskno").style.visibility = "visible";
    let userTask = taskInput.value.trim();
    if(userTask){
        if(!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        const pendingTasksNumb = document.querySelector(".pendingTasks");
        pendingTasksNumb.textContent = todos.length;
        showTodo(document.querySelector("span.active").id);
    }

  }

//   TAKING INPUTS (2 WAYS)

// WHEN ENTER IS CLICKED 
taskInput.addEventListener("keyup", e => {if(e.key == "Enter"){ addTodolist ()}});

// WHEN ADD BUTTON IS CLICKED 
addBtn.onclick = () => addTodolist();