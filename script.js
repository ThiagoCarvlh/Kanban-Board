let tasks = JSON.parse(localStorage.getItem("kanban-tasks")) || [];

const modal = document.getElementById("modal");
const addTaskBtn = document.getElementById("addTask");
const saveTaskBtn = document.getElementById("saveTask");
const cancelTaskBtn = document.getElementById("cancelTask");
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");
const taskPriority = document.getElementById("taskPriority");

addTaskBtn.addEventListener("click", () => {
  openModal();
});

cancelTaskBtn.addEventListener("click", () => {
  closeModal();
});

saveTaskBtn.addEventListener("click", () => {
  const title = taskTitle.value.trim();
  if (!title) return;

  const task = {
    id: Date.now(),
    title: title,
    description: taskDesc.value.trim(),
    priority: taskPriority.value,
    status: "todo",
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  closeModal();
});

function openModal() {
  modal.classList.remove("hidden");
  clearForm();
}

function closeModal() {
  modal.classList.add("hidden");
  clearForm();
}

function clearForm() {
  taskTitle.value = "";
  taskDesc.value = "";
  taskPriority.value = "medium";
}

function saveTasks() {
  localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function moveTask(id, newStatus) {
  const task = tasks.find((t) => t.id === id);
  if (task && task.status !== newStatus) {
    task.status = newStatus;
    saveTasks();
    renderTasks();
  }
}

function createTaskElement(task) {
  const taskEl = document.createElement("div");
  taskEl.className = "task";
  taskEl.dataset.id = task.id;

  let moveButtons = "";

  if (task.status === "todo") {
    moveButtons = `<button class="move-btn" onclick="moveTask(${task.id}, 'doing')">Fazer</button>`;
  } else if (task.status === "doing") {
    moveButtons = `
            <button class="move-btn" onclick="moveTask(${task.id}, 'todo')">Voltar</button>
            <button class="move-btn" onclick="moveTask(${task.id}, 'done')">Feito</button>
        `;
  } else if (task.status === "done") {
    moveButtons = `<button class="move-btn" onclick="moveTask(${task.id}, 'doing')">Refazer</button>`;
  }

  taskEl.innerHTML = `
        <h4>${task.title}</h4>
        <p>${task.description}</p>
        <span class="priority ${task.priority}">${task.priority}</span>
        <div class="task-actions">
            ${moveButtons}
            <button class="delete-btn" onclick="deleteTask(${task.id})">Excluir</button>
        </div>
    `;

  return taskEl;
}

function renderTasks() {
  const todoCol = document.getElementById("todo");
  const doingCol = document.getElementById("doing");
  const doneCol = document.getElementById("done");

  todoCol.innerHTML = "";
  doingCol.innerHTML = "";
  doneCol.innerHTML = "";

  tasks.forEach((task) => {
    const taskEl = createTaskElement(task);
    if (task.status === "todo") {
      todoCol.appendChild(taskEl);
    } else if (task.status === "doing") {
      doingCol.appendChild(taskEl);
    } else if (task.status === "done") {
      doneCol.appendChild(taskEl);
    }
  });
}

renderTasks();
