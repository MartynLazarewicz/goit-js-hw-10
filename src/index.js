// import styles.css
import './css/index.min.css';

//  Import a func that fetches countries from the server
import './js/fetchCountries.js';

import { fetchCountries } from './js/fetchCountries';

// Import lodash.debounce library
import { debounce } from 'lodash';

// Import Notifix library
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

// Helper class for querySelector
const qs = selector => document.querySelector(selector);

const country = {
  box: qs('#search-box'),
  list: qs('.country--list'),
  info: qs('.country--info'),
};

const DEBOUNCE_DELAY = 300;

country.box.addEventListener('input', debounce(searchBoxValue, DEBOUNCE_DELAY));

function searchBoxValue() {
  fetchCountries(country.box.value.trim())
    .then(countries => renderResults(countries))
    .catch(error => {
      if (country.box.value !== '') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      clearElements(country.list, country.info);
      console.log(`Error: ${error.message}`);
    });
}

function renderResults(countries) {
  if (countries.length > 10) {
    clearElements(country.list, country.info);
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length >= 2 && countries.length <= 10) {
    clearElements(country.list, country.info);
    const markup = countries
      .map(
        ({ name, flags }) => `<li class="country--item">
          <img class="country--flag__thumbnail" src="${flags.svg}" alt="The flag of ${name.common}">
          <p class="country--name--thumbnail">${name.common}</p>
        </li>`,
      )
      .join('');
    country.list.innerHTML = markup;
  } else if (countries.length === 1) {
    clearElements(country.list, country.info);
    const markup = countries
      .map(
        ({ name, flags, capital, population, languages }) =>
          `<h2 class="country--name"><img class="country--flag__full" src="${flags.svg}" alt="The flag of ${name.common}">${
            name.common
          }</h2>
            <p class="country--capital"><span>Capital:</span> ${capital}</p>
            <p class="country--population"><span>Population:</span> ${population}</p>
            <p class="country--languages"><span>Langugaes:</span> ${Object.values(languages).join(', ')}</p>`,
      )
      .join('');
    country.info.innerHTML = markup;
  } else if (countries.length < 1) {
    clearElements(country.list, country.info);
  }
}

function clearElements(...fetchedData) {
  fetchedData.forEach(fetchedData => (fetchedData.innerHTML = ''));
}
