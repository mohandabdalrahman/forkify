import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/list';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
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
    //console.log(id);
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlighted selected
    if (state.search) searchView.highLightSelected(id);

    // craete new object
    if (id) {
        state.recipe = new Recipe(id);
    }
    try {
        // get recipe data
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        state.recipe.calcTime();
        state.recipe.calcServings();

        //render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe,state.like.isLiked(id));
        console.log(state.recipe);


    } catch (err) {
        alert('processing error');
        console.log(err);
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// CONTROL LIST

const constrolList = () => {
    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

// handle delete and update list item
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.matches('.shopping__delete,.shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id)
    }
    else if (e.target.matches('.shopping__count-value')) {
        const newCount = parseFloat(e.target.value, 10);
        state.list.updateItem(id, newCount)
    }
})


// CONTROL LIKES;

const controlLikes = () => {

    if (!state.like) state.like = new Likes();

    const currentId = state.recipe.id;
    // user has not liked
    if (!state.like.isLiked(currentId)) {
        const newLike = state.like.addLikes(currentId, state.recipe.title, state.recipe.author, state.recipe.img);

        likeView.toggleLikedBtn(true);
        likeView.renderLike(newLike);
    }
    else {
        state.like.deleteLike(currentId);
        likeView.toggleLikedBtn(false)
        likeView.deleteLike(currentId);

    }

    likeView.toggleLikeMenu(state.like.getNumLikes())
}


// restore recipe when page load

window.addEventListener('load',()=>{

    state.like=new Likes();

    state.like.readStorage();

    likeView.toggleLikeMenu(state.like.getNumLikes());

    state.like.likes.forEach(like => likeView.renderLike(like))
})

elements.recipe.addEventListener('click', e => {

    if (e.target.matches('.btn-decrease , .btn-decrease *')) {
        if (state.recipe.servings > 1) {

            state.recipe.uupdateServings('dec');
            recipeView.updateServingsIngrdients();
        }
    }

    else if (e.target.matches('.btn-increase , .btn-increase *')) {

        state.recipe.uupdateServings('inc');
        recipeView.updateServingsIngrdients();
    }

    else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')) {
        constrolList()
    }

    else if (e.target.matches('.recipe__love,.recipe__love *')) {
        controlLikes()
    }

})
