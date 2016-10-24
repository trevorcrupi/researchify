import alt from '../alt';
import ArticleActions from '../actions/ArticleActions';

class ArticleStore {
  constructor() {
    this.bindActions(ArticleActions);
    this.content = '';
    this.title = '';
    this.author = '';
    this.url = '';
  }

  onGetArticleSuccess(data) {
    this.content = data.content;
    this.title = data.title;
    this.author = data.author;
    this.url = data.url;
  }

  onGetArticleFail(error) {
    //toaster.error(error) ???
    return;
  }
}

export default alt.createStore(ArticleStore);
