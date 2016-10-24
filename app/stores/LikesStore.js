import alt from '../alt';
import LikesActions from '../actions/LikesActions';

class LikesStore {
  constructor() {
    this.bindActions(LikesActions);
    this.likedArticles = [];
  }

  onGetLikedArticlesSuccess(data) {
    this.likedArticles = [];
  }

  onGetLikedArticlesFail(error) {
    toaster.error(error);
  }
}

export default alt.createStore(LikesStore);
