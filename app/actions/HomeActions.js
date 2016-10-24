import alt from '../alt';

class HomeActions {
  constructor() {
    this.generateActions(
      'getArticlesSuccess',
      'getArticlesFail',
      'getLikesSuccess',
      'getLikesFail',
      'likeSuccess',
      'likeFail',
      'unlikeSuccess',
      'unlikeFail'
    );
  }

  getArticles() {
    $.ajax({ url: '/api/articles' })
      .done(data => {
        this.actions.getArticlesSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getArticlesFail(jqXhr.responseJSON.message);
      });
  }

  like(id, className) {
    $.ajax({
      type: 'PUT',
      url: '/api/like',
      data: { article_id: id }
    })
      .done(() => {
        this.actions.likeSuccess(className);
        this.actions.getLikes();
      })
      .fail((jqXhr) => {
        this.actions.likeFail(jqXhr.responseJSON.message);
      });
  }

  unlike(id, className) {
    $.ajax({
      type: 'PUT',
      url: '/api/unlike',
      data: { article_id: id }
    })
      .done(() => {
        this.actions.unlikeSuccess(className);
        this.actions.getLikes();
      })
      .fail((jqXhr) => {
        this.actions.unlikeFail(jqXhr.responseJSON.message);
      });
  }

  getLikes() {
    $.ajax({ url: '/api/likes' })
      .done((data) => {
        this.actions.getLikesSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getLikesFail(jqXhr.responseJSON.message);
      });
  }

}

export default alt.createActions(HomeActions);
