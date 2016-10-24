import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
  constructor() {
    this.bindActions(HomeActions);
    this.articles = [];
    this.likes = [];
  }

  onGetArticlesSuccess(data) {
    this.articles = data;
  }

  onGetArticlesFail(error) {
    toaster.error(error)
  }

  onGetLikesSuccess(data) {
    this.likes = data;
  }

  onGetLikesFail(message) {
    toastr.error(message);
  }

  onLikeSuccess(className) {
    $(className).addClass("fa-heart");
    $(className).removeClass("fa-heart-o");
  }

  onLikeFail(error) {
    toastr.error(error)
  }

  onUnlikeSuccess(className) {
    $(className).addClass("fa-heart-o");
    $(className).removeClass("fa-heart");
  }

  onUnlikeFail(error) {
    toastr.error(error)
  }

}

export default alt.createStore(HomeStore);
