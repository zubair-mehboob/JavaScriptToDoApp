const ADD_TASK = "ADD_TASK";
const DELETE_TASK = "DELETE_TASK";
const TOGGLE_TASK = "TOGGLE_TASK";

const ADD_MOVIE = "ADD_MOVIE";
const DELETE_MOVIE = "DELETE_MOVIE";
const TOGGLE_MOVIE = "TOGGLE_MOVIE";

function task_reducer(state = [], action) {
  switch (action.type) {
    case ADD_TASK:
      return [...state, action.task];
    case DELETE_TASK:
      return state.filter(r => r.id !== action.id);
    case TOGGLE_TASK:
      return state.map(r => (r.id === action.id ? { ...r, done: !r.done } : r));
    default:
      return state;
  }
}
function movie_reducer(state = [], action) {
  switch (action.type) {
    case ADD_MOVIE:
      return [...state, action.movie];
    case DELETE_MOVIE:
      return state.filter(r => r.id !== action.id);
    case TOGGLE_MOVIE:
      return state.map(r => (r.id === action.id ? { ...r, done: !r.done } : r));
    default:
      return state;
  }
}

function rootReducer(state = [], action) {
  return {
    task: task_reducer(state.task, action),
    movie: movie_reducer(state.movie, action)
  };
}
function createStore(reducer) {
  let state;
  let listners = [];
  //console.log(listners);
  const dispatch = action => {
    state = rootReducer(state, action);
    console.log(listners);

    listners.forEach(l => l());
  };
  const getState = () => state;
  const subscribe = listner => {
    listners.push(listner);
    return () => {
      listners = () => listners.filter(l => l !== listner);
    };
  };

  return {
    getState,
    subscribe,
    dispatch
  };
}

const store = createStore(rootReducer);
//console.log(store.getState());
//=========================================

let unsubscribe = store.subscribe(() => {
  const { task, movie } = store.getState();
  document.getElementById("task-list").innerHTML = "";
  task.forEach(t => addTaskToDom(t));
  document.getElementById("movie-list").innerHTML = "";
  movie.forEach(m => addMovieToDom(m));
});
unsubscribe = store.subscribe(() => console.log("I am invoked"));
//unsubscribe();
const addTaskToDom = t => {
  const ul = document.getElementById("task-list");
  const li = document.createElement("li");
  const a = document.createElement("a");
  const taskText = document.createTextNode(t.name);
  const btnTask = document.createElement("button");
  const btnTaskTxt = document.createTextNode("X");
  btnTask.appendChild(btnTaskTxt);
  btnTask.addEventListener("click", () => deleteTask(t.id));
  a.setAttribute("href", "#");
  a.setAttribute("id", t.id);
  a.appendChild(taskText);
  li.appendChild(a);
  li.appendChild(btnTask);

  a.addEventListener("click", () => toggleTask(t.id));
  a.style.textDecoration = t.done && "line-through";
  ul.appendChild(li);
};

const addMovieToDom = m => {
  const ul = document.getElementById("movie-list");
  const li = document.createElement("li");
  const movieText = document.createTextNode(m.name);
  const a = document.createElement("a");
  const btnMovie = document.createElement("button");
  const btnMovieTxt = document.createTextNode("X");
  btnMovie.appendChild(btnMovieTxt);
  btnMovie.addEventListener("click", () => deleteMovie(m.id));
  a.setAttribute("href", "#");
  li.setAttribute("id", m.id);
  a.appendChild(movieText);
  li.appendChild(a);
  li.appendChild(btnMovie);
  a.addEventListener("click", () => toggleMovie(m.id));
  a.style.textDecoration = m.done && "line-through";
  ul.appendChild(li);
};
//===================================

function deleteTaskActionCreator(id) {
  console.log("del");

  return {
    type: DELETE_TASK,

    id
  };
}
function toggleTaskActionCreator(id) {
  console.log("tog");

  return {
    type: TOGGLE_TASK,

    id
  };
}
function addTaskActionCreator(name) {
  return {
    type: ADD_TASK,
    task: {
      id: generateId(),
      name,
      done: false
    }
  };
}
function deleteMovieActionCreator(id) {
  return {
    type: DELETE_MOVIE,

    id
  };
}
function toggleMovieActionCreator(id) {
  return {
    type: TOGGLE_MOVIE,

    id
  };
}
function addMovieActionCreator(name) {
  return {
    type: ADD_MOVIE,
    movie: {
      id: generateId(),
      name,
      done: false
    }
  };
}

function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}

function addToDoTask() {
  let task = document.getElementById("txt_task").value;
  document.getElementById("txt_task").value = "";
  store.dispatch(addTaskActionCreator(task));
  //console.log(store.getState());
}
function addMovie() {
  let movie = document.getElementById("txt_movie").value;
  document.getElementById("txt_movie").value = "";
  store.dispatch(addMovieActionCreator(movie));
  console.log(store.getState());
}

const deleteTask = id => store.dispatch(deleteTaskActionCreator(id));
const toggleTask = id => store.dispatch(toggleTaskActionCreator(id));
const deleteMovie = id => store.dispatch(deleteMovieActionCreator(id));
const toggleMovie = id => store.dispatch(toggleMovieActionCreator(id));
// store.dispatch(deleteTaskActionCreator(id));
// store.dispatch(toggleTaskActionCreator(id));
// store.dispatch(addMovieActionCreator("Ertugrul"));
// store.dispatch(deleteMovie);
// store.dispatch(toggleMovie);
