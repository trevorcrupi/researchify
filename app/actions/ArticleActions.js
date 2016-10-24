import alt from '../alt';

class ArticleActions {
  constructor() {
    this.generateActions(
      'getArticleSuccess',
      'getArticleFail'
    );
  }

  getArticle(id) {
    $.ajax({ url: '/api/article/'+id })
      .done(data => {
        this.actions.getArticleSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getArticleFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(ArticleActions);
