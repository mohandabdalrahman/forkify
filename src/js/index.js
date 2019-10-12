import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
/**
 global state of the app 
 * search object
 */

const state = {};

/** SEARCH CONTROLLER */

const controlSearch = async () => {
    // get query from the view
    const query = searchView.getInput();
    console.log(query);
    if (query) {
        state.search = new Search(query)
    }

    try {
        // prepare ui for results 
        searchView.clearSearchList();
        renderLoader(elements.searchResults);
        // search for recipes
        await state.search.getResults();

        //render results
        clearLoader();
        searchView.renderResults(state.search.results)
    } catch (err) {
        alert('error in searching');
        console.log(err);
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
    elements.searchInput.value = "";
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearSearchList();
        searchView.renderResults(state.search.results, goToPage)
    }
});


/** RECIPE CONTROLLER */

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id);

    // craete new object
    if (id) {
        state.recipe = new Recipe(id)
    }
    try {
        // get recipe data
        await state.recipe.getRecipe();
        state.recipe.calcTime();
        state.recipe.calcServings();

    } catch (err) {
        alert('processing error');
        console.log(err);
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))