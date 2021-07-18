'use strict';

const search = document.getElementById('search');
const submit = document.getElementById('submit');
const meals = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const random = document.getElementById('random');
const singleMeal = document.getElementById('single-meal');

const singleMealDisplayUI = function (meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push({
        ing: meal[`strIngredient${i}`],
        mea: meal[`strMeasure${i}`],
      });
    }
  }

  singleMeal.innerHTML = `
	<div class="single-meal">
					<h1>${meal.strMeal}</h1>
					<img src="${meal.strMealThumb}" alt="${meal.strMeal}">
					<div class="single-meal-info">
						<p>${meal.strCategory}</p>
						<p>${meal.strArea}</p>
					</div>
					<div class="main">
						<p>${meal.strInstructions}</p>
						<h2>Ingredients</h2>
						<ul>
							${ingredients.map((ings) => `<li>${ings.ing} ${ings.mea}</li>`).join('')}
						</ul>
					</div>
				</div>
	`;

  resultHeading.textContent = '';
};

const multiDisplayUI = function (data) {
  resultHeading.textContent = `Search for ${search.value}`;

  data.forEach((meal) => {
    const div = document.createElement('div');
    div.classList.add('meal');
    div.addEventListener('click', function () {
      const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`;
      fetchData(url);
    });
    div.innerHTML = `
			<img src="${meal.strMealThumb}" alt="${meal.strMeal}">
			<div class="meal-info" data-mealid="${meal.idMeal}">
				<h3>${meal.strMeal}</h3>
			</div>
		`;

    meals.appendChild(div);
  });

  search.value = '';
};

const noResult = function () {
  resultHeading.textContent = `No Search Result for ${search.value}`;
  meals.innerHTML = '';
  search.value = '';
};

const fetchData = async function (url) {
  const res = await fetch(url);
  const { meals } = await res.json();
  console.log(meals);
  if (!meals) noResult();
  if (meals?.length > 1) multiDisplayUI(meals);
  if (meals?.length === 1) singleMealDisplayUI(meals[0]);
};

const randomMeal = function () {
  fetchData(`https://www.themealdb.com/api/json/v1/1/random.php`);
};

const searchMeals = function (e) {
  e.preventDefault();
  const userSearch = search.value.trim().toLowerCase();

  fetchData(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${userSearch}`
  );
};

random.addEventListener('click', () => {
  meals.innerHTML = '';
  randomMeal();
});
submit.addEventListener('submit', (e) => {
  singleMeal.innerHTML = '';
  searchMeals(e);
});
