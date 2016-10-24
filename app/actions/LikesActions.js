import alt from '../alt';

class LikesActions {
  constructor() {
    this.generateActions(
      'getLikedArticlesSuccess',
      'getLikedArticlesFail'
    );
  }

  getLikedArticles(id) {
    $.ajax({ url: '/api/likes' })
      .done(data => {
        this.actions.getLikedArticlesSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getLikedArticlesFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(LikesActions);
