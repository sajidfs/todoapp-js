let tasks;

const ulElement = document.querySelector(".todo-list");
const btnAdd = document.querySelector("#add");
const rStatus = document.querySelectorAll("input[type=radio]");
const LOCAL_STORAGE_TODOJS_KEY = "todojs.tasks";

try {
  tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOJS_KEY)) || [];
} catch (err) {
  tasks = [];
}

const saveToLocal = () => {
  localStorage.setItem(LOCAL_STORAGE_TODOJS_KEY, JSON.stringify(tasks));
};

const markComplete = (e) => {
  const id = e.target.id;
  let findTask = tasks.find((task) => task.id === id);
  findTask.completed = true;
  tasks.forEach((task, index) => {
    if (task.id === findTask.id) {
      tasks[index] = findTask;

      e.target.previousElementSibling.classList.toggle("item-complete");
      e.target.classList.toggle("btn-item-complete");
      e.target.disabled= true;
      e.target.nextElementSibling.classList.toggle("btn-item-complete");
      e.target.nextElementSibling.disabled = true;
      
    }
  });
  saveToLocal();
};

const deleteTask = (e) => {
  const id = e.target.id;
  const liElement = e.target.parentElement.parentElement.parentElement;
  let findTask = tasks.find((task) => task.id === id);
  tasks.forEach((task, index) => {
    if (task.id === findTask.id) {
      tasks.splice(index, 1);

      liElement.remove();
    }
  });
  saveToLocal();
};

const addToList = (e) => {
  e.preventDefault();

  const taskname = document.getElementById("taskname").value;

  if (!taskname) {
    alert('Task name is required.');
    return;
  }

  const task = {
    id: new Date().getTime().toString(),
    title: taskname,
    completed: false
  };
  tasks.push(task);

  const liTemplate = `
        <div class='card'>
            <div class='card-body'>
                <h5 class='item'>${task.title}</h5>
                <button class='btn-item' id="${task.id}" onClick="markComplete(event)">✓</button>
                <button class='btn-item' id="${task.id}" onClick="deleteTask(event)">x</button>
            </div>
        </div>`;

  const liEl = document.createElement("li");
  liEl.innerHTML = liTemplate;
  ulElement.appendChild(liEl);

  saveToLocal();
  document.getElementById("taskname").value = "";
};

btnAdd.addEventListener("click", addToList);

const selectedStatus = () => {
  let selectedValue;
  for (const status of rStatus) {
    if (status.checked) {
      selectedValue = status.value;
      break;
    }
  }
  return selectedValue;
};

const filteredTaskList = () => {
  const selectedValue = selectedStatus();
  let filteredTasks;

  switch (selectedValue) {
    case "completed":
      filteredTasks = tasks.filter((task) => task.completed === true);
      break;
    case "active":
      filteredTasks = tasks.filter((task) => task.completed === false);
      break;
    default:
      filteredTasks = tasks.filter(
        (task) => (task.completed === true) | (task.completed === false)
      );
      break;
  }

  return filteredTasks;
};

const render = () => {
  clearList();

  const filteredTasks = filteredTaskList();

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    const card = document.createElement("div");
    card.classList.add("card");
    li.appendChild(card);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    card.appendChild(cardBody);
    const cardTitle = document.createElement("h5");
    if (task.completed) {
      cardTitle.classList.add("item-complete");
    } else {
      cardTitle.classList.add("item");
    }

    cardTitle.textContent = task.title;

    const btnComplete = document.createElement("button");
    btnComplete.id = task.id;
    if (task.completed) {
      btnComplete.classList.add("btn-item-complete");
      btnComplete.disabled = true;
    } else {
      btnComplete.classList.add("btn-item");
      btnComplete.disabled = false;
    }
    btnComplete.addEventListener("click", markComplete);
    btnComplete.textContent = "✓";

    const btnDelete = document.createElement("button");
    btnDelete.id = task.id;
    if (task.completed) {
      btnDelete.classList.add("btn-item-complete");
    } else {
      btnDelete.classList.add("btn-item");
    }
    btnDelete.addEventListener("click", deleteTask);
    btnDelete.textContent = "x";

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(btnComplete);
    cardBody.appendChild(btnDelete);

    ulElement.appendChild(li);
  });
};

const clearList = () => {
  while (ulElement.firstChild) {
    ulElement.removeChild(ulElement.firstChild);
  }
};

document.addEventListener("DOMContentLoaded", render);
