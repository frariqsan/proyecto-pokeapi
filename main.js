const pokedex$$ = document.getElementById("pokedex");
const ALL_POKEMONS = [];
const TYPES = ["all"];

const getAllPokemons = () => {
  return fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((response) => response.json())
    .then((response) => response.results)
    .catch((error) => console.log("Error obteniendo todos los pokemons", error));
};

const getIndividualPokemon = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((response) => {

      const pokemon = {
        name: response.name,
        id: response.id,
        type: response.types.map((type) => type.type.name),
        image: response.sprites.versions["generation-v"]["black-white"].animated.front_shiny,
      };
      pokemon.type.forEach((type) => {
        if (!TYPES.includes(type)) {
          TYPES.push(type);
        }
      });

      return pokemon;
    })
    .catch((error) => console.log("Error obteniendo todos los pokemons", error));
};

const drawPokemons = (pokemons) => {

  pokedex$$.innerHTML = ""; 

  pokemons.forEach((poke) => {

    const li = document.createElement("li");

    li.classList.add("card");
    const html = `
            <img src=${poke.image} alt=${poke.name}>
            <p class="card-title">${poke.name}<p>
            <div class="card-subtitle">${poke.type[0]} ${poke.type[1] ? `, ${poke.type[1]}` : ""}</div>
        `;
    li.innerHTML = html;
    pokedex$$.appendChild(li);
  });
};

const filter = (event) => {

  const inputValue = event.target.value.toLowerCase();
  const filtered = ALL_POKEMONS.filter((pokemon) => {
    const matchName = pokemon.name.toLowerCase().includes(inputValue);
    const matchId = pokemon.id === Number(inputValue);

    return matchName || matchId;
  });

  drawPokemons(filtered);
};

const addAllMyEventsListeners = () => {
  document.getElementById("input-search").addEventListener("input", filter);
};

const filterByType = (event) => {
  const typeToFilter = event.target.classList[0]; 

  if (typeToFilter === "all") {

    return drawPokemons(ALL_POKEMONS);
  }

  const filtered = ALL_POKEMONS.filter((pokemon) => {
    const matchType = pokemon.type.includes(typeToFilter);
    return matchType;
  });

  drawPokemons(filtered);
};

//const drawTypesButtons = () => {
  //const typesContainer$$ = document.querySelector(".types");

  // TYPES.forEach((type) => {
  //   const span = document.createElement("span");
  //   span.classList.add(type);
  //   span.addEventListener("click", filterByType);
  //   span.innerText = type;
  //   typesContainer$$.appendChild(span);
  // });
//};

const startMyCode = async () => {
  addAllMyEventsListeners();

  const allPokemons = await getAllPokemons(); 

  for (const pokemon of allPokemons) {
    const pokemonInfo = await getIndividualPokemon(pokemon.url);
    ALL_POKEMONS.push(pokemonInfo);
  }

  //drawTypesButtons();
  drawPokemons(ALL_POKEMONS);
};

startMyCode();
