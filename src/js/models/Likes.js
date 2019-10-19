import uniqid from 'uniqid';
export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLikes(id, title, author, img) {
        const like = {
            id: uniqid(),
            title,
            author,
            img
        }
        this.likes.push(like);

        this.persistData()
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.persistData()
    }

    getNumLikes() {
        return this.likes.length
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1
    }

    // persist data
    persistData(){
        localStorage.setItem('likes',JSON.stringify(this.likes))
    }

    // read data from localStorage
    readStorage(){
        const storage=JSON.parse(localStorage.getItem('likes'));
        if(storage) this.likes=storage
    }
}