import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query
    }
    async getResults() {
        //const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = 'd3f20186dfb1fb29714aad613610aa83';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            console.log(res);
            this.results = res.data.recipes

        } catch (error) {
            alert('Something went wrong');
            console.log(error);
        }

    }

}