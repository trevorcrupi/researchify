import React from 'react';
import ArticleStore from '../stores/ArticleStore';
import ArticleActions from '../actions/ArticleActions';

class Article extends React.Component {

  constructor(props) {
    super(props);
    this.state = ArticleStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    ArticleStore.listen(this.onChange);
    ArticleActions.getArticle(this.props.params.id);
  }

  componentWillUnmount() {
    ArticleStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    var content = {__html: this.state.content};

    return (
      <div>

        <header className="article-intro-header intro-header">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                        <div className="post-heading">
                            <h1>{this.state.title}</h1>
                            <h2 className="subheading">Problems look mighty small from 150 miles up</h2>
                            <span className="meta">Posted by <a href="#">{this.state.author}</a> on August 24, 2014</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <article>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1" dangerouslySetInnerHTML={content}>

                    </div>
                </div>
            </div>
        </article>

      </div>
    );
  }
}

export default Article;
