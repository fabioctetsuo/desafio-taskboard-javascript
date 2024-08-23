let tasks = [
  {
    id: 1,
    title: "Implementar tela de listagem de tarefas",
    tag: "frontend",
    created_at: new Date().toISOString(),
    done: false,
  },
  {
    id: 2,
    title: "Criar endpoint para cadastro de tarefas",
    tag: "backend",
    created_at: new Date().toISOString(),
    done: false,
  },
  {
    id: 3,
    title: "Implementar protótipo da listagem de tarefas",
    tag: "ux",
    created_at: new Date().toISOString(),
    done: true,
  },
];

/*
  Helpers
  - Úteis para reaproveitamento de código 
  - Melhorar legibilidade
  - Manter funções com o princípio de responsabilidade única
*/

const getNewId = () => {
  const [lastId] = tasks.map(({ id }) => id).sort((a, b) => b - a);
  return lastId ? lastId + 1 : 1;
};

const getNewTaskPayload = (titleInput, tagInput) => ({
  id: getNewId(),
  title: titleInput.value,
  tag: tagInput.value,
  created_at: new Date().toISOString(),
  done: false,
});

const cleanForm = (titleInput, tagInput) => {
  titleInput.value = "";
  tagInput.value = "";
};

const getFormattedDate = (isoDate) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

/*
  Funções gerenciadoras do DOM
  - Controla o DOM, manipulando, adicionando e removendo elementos do mesmo 
*/

const addCheckedIconInDOMArticle = (article) => {
  const checkedIcon = document.createElement("img");
  checkedIcon.src = "./assets/checked-icon.png";
  checkedIcon.alt = "Tarefa concluída";
  article.appendChild(checkedIcon);
};

const addTitleDisabledClass = (title) => {
  title.className = "task-title-disabled";
};

const handleDoneTasksInDOM = ({ article, title }) => {
  addCheckedIconInDOMArticle(article);
  addTitleDisabledClass(title);
};

const createArticleInDOM = (task) => {
  const tasksList = document.getElementById("tasks-list-container");
  const article = document.createElement("article");
  const section = document.createElement("section");
  const title = document.createElement("h5");
  const detailsWrapper = document.createElement("div");
  const tag = document.createElement("span");
  const dateInfo = document.createElement("span");

  article.className = "task-card";
  article.id = `task-card-${task.id}`;
  section.className = "task-info-container";
  detailsWrapper.className = "task-details-container";
  tag.className = "task-details-tag";
  dateInfo.className = "task-details-date";

  detailsWrapper.appendChild(tag);
  detailsWrapper.appendChild(dateInfo);
  section.appendChild(title);
  section.appendChild(detailsWrapper);
  article.appendChild(section);
  tasksList.appendChild(article);

  if (task.done) {
    handleDoneTasksInDOM({ article, title });
  } else {
    const button = document.createElement("button");
    button.textContent = "Concluir";
    button.onclick = () => finishTask(task.id);
    article.appendChild(button);
  }

  title.textContent = task.title;
  tag.textContent = task.tag;
  dateInfo.textContent = `Criado em: ${getFormattedDate(task.created_at)}`;

  return article;
};

const addNewArticle = (event) => {
  event.preventDefault();
  const { target: form } = event;
  const titleInput = form["new-task-input-name"];
  const tagInput = form["new-task-input-tag"];

  const newTask = getNewTaskPayload(titleInput, tagInput);
  tasks = [...tasks, newTask];
  createArticleInDOM(newTask);
  cleanForm(titleInput, tagInput);
  updateDOMCounter();
};

const updateDOMCounter = () => {
  const counter = document.getElementById("done-tasks-counter");

  const totalDoneTasks = tasks.filter((task) => task.done).length;
  const isSingular = totalDoneTasks === 1;
  const plural = isSingular ? "" : "s";

  counter.textContent = `${totalDoneTasks} tarefa${plural} concluída${plural}`;
};

const finishTask = (id) => {
  tasks = tasks.map((task) => {
    if (task.id === id) return { ...task, done: true };
    return task;
  });
  const article = document.getElementById(`task-card-${id}`);
  const [title] = article.getElementsByTagName("h5");
  const [buttonToRemove] = article.getElementsByTagName("button");
  article.removeChild(buttonToRemove);

  handleDoneTasksInDOM({ article, title });
  updateDOMCounter();
};

const loadScreen = () => {
  const form = document.getElementById("new-task-form");

  form.addEventListener("submit", addNewArticle);
  tasks.forEach(createArticleInDOM);
  updateDOMCounter();
};

window.onload = loadScreen;
