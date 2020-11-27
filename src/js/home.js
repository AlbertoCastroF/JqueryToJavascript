// CLASE DE PROMESAS
// const getUser = new Promise(function(todoBien, todoMal) {
//  // llamar a un API
//  setTimeout(function() {
//   // luego de 3 segundos
//   todoBien('se acabo el tiempo');
//  }, 5000)
 
// })

// const getUserAll = new Promise(function(todoBien, todoMal) {
//  // llamar a un API
//  setTimeout(function() {
//   // luego de 3 segundos
//   todoBien('se acabo el tiempo x2');
//  }, 3000)
 
// })

// getUser
//  .then(function() {
//   console.log('todo esta bien!')
//  })
//  .catch(function(message) {
//   console.log(message)
//  })

 // Promise.race([
 //  getUser,
 //  getUserAll
 // ])
 // .then(function(message) {
 //  console.log(message)
 // })
 // .catch(function(message) {
 //  console.log(message)
 // })

// CLASE DE AJAX EN JQUERY Y JAVASCRIPT

// EN JQUERY
// $.ajax('https://randomuser.me/api/', {
// method: 'GET',
// success: function(data) {
//  console.log(data)
// },
// error: function(error) {
//  console.log(error)
// } 
// })

// EN JAVASCRIPT
// fetch('https://randomuser.me/api/')
// .then(function(response) {
//  console.log(response)
//  return response.json()
// })
// .then(function(user) {
//  console.log('user', user.results[0].name.first)
// })
// .catch(function() {
//  console.log('algo fallo')
// });

// FUNCIONES ASINCRONAS

(async function load() {
 // await 
 // action
 // terror
 // animation

 async function getData(url) {
  const response = await fetch(url)
  const data = await response.json()
  if (data.data.movie_count > 0) {
   return data
  }
  throw new Error('No se encontro ningun resultado')
 }

 const $form = document.querySelector('#form')
 const $home = document.querySelector('#home')
 const $featuringContainer = document.querySelector('#featuring')
 // EVENTOS

 function setAttributes($element, attributes){
  for (const attribute in attributes) {
   $element.setAttribute(attribute, attributes [attribute])
  }
 }
 
  const BASE_API = 'https://yts.mx/api/v2/';

 function featuringTemplate(peli) {
   return (
    `<div class="featuring">
    <div class="featuring-image">
     <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
    </div>
    <div class="featuring-content">
     <p class="featuring-title">Pelicula encontrada</p>
     <p class="featuring-album">${peli.title}</p>
    </div>
   </div>`
   )
  }

 $form.addEventListener('submit', async () => {
  event.preventDefault();
  $home.classList.add('search-active')
  // CREACION DE ELEMENTO Y ASIGNACION DE ATRIBUTOS
  const $loader = document.createElement('img');
  setAttributes($loader, {
   src: 'src/images/loader.gif',
   height: 50,
   width: 50
  })
  $featuringContainer.append($loader);
 // FORMULARIOS



  const data = new FormData($form);
  try {
   const {
    data: {
     movies: pelis
    }
   } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
   const HTMLString = featuringTemplate(pelis[0])
     //FIN DE DESESTRUCTURACION DE DATOS
   $featuringContainer.innerHTML = HTMLString;
  } catch(error) {
   debugger
   alert(error.message);
   $loader.remove();
   $home.classList.remove('search-active');
  }

  // DESESTRUCTURACION DE DATOS
  
 })
 // FIN DE FORMULARIOS
 //FIN DE CREACION DE ELEMENTIO Y ASIGNACION DE ATRIBUTOS
// FIN DE EVENTOS




// FIN DE FUNCIONES ASINCRONAS


// CREACION DE TEMPLATES
function videoItemTemplate(movies, category) {
 return (
  `<div class="primaryPlaylistItem" data-id="${movies.id}" data-category = ${category}>
  <div class="primaryPlaylistItem-image">
   <img src="${movies.medium_cover_image}">
  </div>
  <h4 class="primaryPlaylistItem-title">
   ${movies.title}
  </h4>
 </div>`
 )
}
 // FIN DE CREACION DE TEMPLATES
 function createTemplate(HTMLString) {
  // CREACION DE DOM
  const html = document.implementation.createHTMLDocument();
  html.body.innerHTML = HTMLString;
  return html.body.children[0];
  // FIN DE CREACION DE DOM
 }
// EVENTOS
function addEventClick($element) {
$element.addEventListener('click', () => {
showModal($element)

})
// FIN DE EVENTOS
}
function renderMovieList(list, $container, category) {
 $container.children[0].remove();
 list.forEach((movie) => {
  const HTMLString = videoItemTemplate(movie, category);
  const movieElement = createTemplate(HTMLString);
  $container.append(movieElement);
  const image = movieElement.querySelector('img');
  image.addEventListener('load', (event) => {
   event.target.classList.add('fadeIn');
  })
  addEventClick(movieElement)
 })
}



// SELECTORES
// EN JQUERY
// const $home = $('.home')

// EN JAVASCRIPT
async function cacheExist(category) {
 const listName = `${category}List`;
 const cacheList = window.localStorage.getItem(listName);
 if (cacheList) {
  return JSON.parse(cacheList)
 }
 const { data: { movies: data}} = await getData(`${BASE_API}list_movies.json?genre=${category}`)
 window.localStorage.setItem(listName, JSON.stringify(data))
 return data;
}

// const { data: { movies: actionList}} = await getData(`${BASE_API}list_movies.json?genre=action`)
const actionList = await cacheExist('action')
// window.localStorage.setItem('actionList', JSON.stringify(actionList))
const $actionContainer = document.querySelector('#action')
// REUTILIZANDO FUNCIONES
renderMovieList(actionList, $actionContainer, 'action')


const dramaList = await cacheExist('drama')
const $dramaContainer = document.getElementById('drama')
renderMovieList(dramaList, $dramaContainer, 'drama')


const animationList = await cacheExist('animation')
const $animationContainer = document.querySelector('#animation')
renderMovieList(animationList, $animationContainer, 'animation')
// REUTILIZANDO FUNCIONES FIN


const $modal = document.getElementById('modal')
const $overlay = document.getElementById('overlay')
const $hideModal = document.getElementById('hide-modal')

const $modalTitle = $modal.querySelector('h1')
const $modalImage = $modal.querySelector('img')
const $modalDescription = $modal.querySelector('p')
// CLASES Y ESTILOS CSS

// ENCONTRANDO ELEMENTOS EN LA LISTA
function findById(list, id) {
 return list.find(movie => movie.id === parseInt(id, 10))
}
function findMovie(id, category) {
 switch (category){
  case 'action': {
   return findById(actionList, id)
  }
  case 'drama': {
   return findById(dramaList, id)
  }
  default: {
   return findById(animationList, id)
  }
 }
 //FIN ENCONTRANDO ELEMENTOS EN LA LISTA
 
}
// ENCONTRANDO ELEMENTOS EN LA LISTA
function showModal($element) {
 $overlay.classList.add('active');
 $modal.style.animation = 'modalIn .8s forwards';
 const id = $element.dataset.id;
 const category = $element.dataset.category;
 const data = findMovie(id, category)
 $modalTitle.textContent = data.title;
 $modalImage.setAttribute('src', data.medium_cover_image);
 $modalDescription.textContent = data.description_full;
}

$hideModal.addEventListener('click', hideModal);
function hideModal () {
 $overlay.classList.remove('active');
 $modal.style.animation = 'modalOut .8s forwards'
}
// ENCONTRANDO ELEMENTOS EN LA LISTA
// CLASES Y ESTILOS CSS FIN

})();



















// RETO DE EL CURSO JQUERY A JAVASCRIPT - MOSTRAR USUARIOS RANDOM HACIENDO UNA PETICION A RANDOMUSER.Me Y MOSTRAR 10 PELICULAS EN LA SIDEBAR PLAYLIST HACIENDO UNA PETICION A YTS.MX/API

(async function challenge() {

 const $modal = document.getElementById('modal')
 const $overlay = document.getElementById('overlay')
 const $hideModal = document.getElementById('hide-modal')

 const $modalTitle = $modal.querySelector('h1')
 const $modalImage = $modal.querySelector('img')
 const $modalDescription = $modal.querySelector('p')

 // RETO PELICULAS
 async function getMovies(LINK) {
  const movieResponse = await fetch(LINK)
  const movieList = await movieResponse.json()
  return movieList
 }

 const LINK = 'https://yts.mx/api/v2/list_movies.json?limit=10'
 const {data: {movies: movieList}} = await getMovies(LINK)
 window.localStorage.setItem('movielist', JSON.stringify(movieList))
 console.log(movieList)

 const $playList = document.getElementById('playlist')

 function movieTemplate(movie) {
  return (`
  <li class="myPlaylist-item" data-id="${movie.id}">
              <a href="#">
                <span>
                  ${movie.title}
                </span>
              </a>
            </li> 
  `)
 }

 function getMovie(id) {
 return movieList.find(movie => {
  // console.log(movie.id, parseInt(id))
  return movie.id === parseInt(id)
 })
 }

 function showModdal($element) {
  $overlay.classList.add('active')
  $modal.style.animation = "modalIn .8s forwards"
  const id = $element.dataset.id
  const idMovie = getMovie(id)
  $modalTitle.textContent = idMovie.title
  $modalImage.setAttribute('src', idMovie.large_cover_image)
  $modalDescription.textContent = idMovie.description_full
 }


 function addEventclik($element) {
  $element.addEventListener('click', function () {
   showModdal($element)
  })
 }

 function movieHtml(HTMLString) {
  const htmlElement = document.implementation.createHTMLDocument()
  htmlElement.body.innerHTML = HTMLString
  return htmlElement.body.children[0]
 }

 movieList.forEach( function(movie) {
  const HTMLString = movieTemplate(movie)
  const templatehtml = movieHtml(HTMLString)
  $playList.append(templatehtml)
  addEventclik(templatehtml)
 })

// RETO USUARIOS

 async function getUser(URL) {
  const response = await fetch(URL)
  const userData = await response.json()
  return userData
 }

 
 const URL = 'https://randomuser.me/api/?results=10'
 const {results: UsersArray} = await getUser(URL)
 // console.log(UsersArray)

 function FriendTemplate(user) {
  return (
   ` <li class="playlistFriends-item" data-id="${user.login.uuid}">
   <a href="#">
     <img src="${user.picture.thumbnail}" alt="echame la culpa" />
     <span>
       ${user.name.first} ${user.name.last}
     </span>
   </a>
 </li>`
  )
 }

 const friendsPlaylistContainer = document.getElementById('ListaAmigos')

 function createHtmlTemplate(HTMLString) {
  const html = document.implementation.createHTMLDocument()
  html.body.innerHTML = HTMLString
  return html.body.children[0]
 }

 function findUser(id) {
  return UsersArray.find(user => user.login.uuid === id)
 }

 function showModal($element) {
  $overlay.classList.add('active')
  $modal.style.animation = 'modalIn .8s forwards'
  const id = $element.dataset.id;
  const data = findUser(id)
  $modalTitle.textContent = `${data.name.first} ${data.name.last}`
  $modalImage.setAttribute('src', data.picture.large)
  $modalDescription.textContent = data.email
 }

 function addEventClick($element) {
  $element.addEventListener('click', () => {
   showModal($element)
  })
 }

 UsersArray.forEach( function(user) {
  const HTMLString = FriendTemplate(user)
  const friendElement = createHtmlTemplate(HTMLString)
  friendsPlaylistContainer.append(friendElement)
  addEventClick(friendElement)
 
 })

 


   
})()

