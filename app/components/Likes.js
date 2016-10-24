import React from 'react';
import LikesStore from '../stores/LikesStore';
import LikesActions from '../actions/LikesActions';

class Likes extends React.Component {

  constructor(props) {
    super(props);
    this.state = LikesStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    LikesStore.listen(this.onChange);
    LikesActions.getLikedArticles();
  }

  componentWillUnmount() {
    LikesStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    // Create

    // <ArticleMenu>
    // <ToolBar>
    var articles = this.state.articles.map((article, index) => {
      return (
        <div>
          <div className={"post-preview article-" + this.slugify(article.title)}>
              <Link to={'/articles/' + article._id}>
                  <h2 className="post-title">
                      {article.title}
                  </h2>
                  <h3 className="post-subtitle">
                      Problems look mighty small from 150 miles up
                  </h3>
              </Link>
              <p className="post-meta">Posted by <a href="#">{article.author}</a> on September 24, 2014</p>

              <ul className="tool-list">
                <li onClick={this.handleLike.bind(this, article._id, article.title)}>
                  <i className={this.findLike(article._id) ? "fa fa-heart" : "fa fa-heart-o"} aria-hidden="true"></i>
                </li>

                <li>
                  <a href="#"><i className="fa fa-trash-o" aria-hidden="true"></i></a>
                </li>

                <li>
                  <a href="#"><i className="fa fa-share" aria-hidden="true"></i></a>
                </li>
              </ul>

          </div>
          <hr></hr>
        </div>
      );
    });

		return (
      <div>

      <header className="intro-header">
          <div className="container">
              <div className="row">
                  <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                      <div className="site-heading">
                          <h1>Dashboard</h1>
                          <hr className="small"></hr>
                          <span className="subheading">Start Researching. Start Changing the world.</span>
                      </div>
                  </div>
              </div>
          </div>
      </header>

        <div className="container">
            <div className="row">

              <div className="col-lg-2 col-md-2 sidebar">
                <ul>
                  <li>
                    <a href="#">
                      <i className="fa fa-home sidebar-icon" aria-hidden="true"></i>Home
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <i className="fa fa-heart-o sidebar-icon" aria-hidden="true"></i>Liked
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <i className="fa fa-sticky-note-o sidebar-icon" aria-hidden="true"></i>Notes
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <i className="fa fa-pencil-square-o sidebar-icon" aria-hidden="true"></i>Citations
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <i className="fa fa-play-circle-o sidebar-icon" aria-hidden="true"></i>Videos
                    </a>
                  </li>

                </ul>
                <hr></hr>
                <ul>
                  <li>
                    <a href="#">
                      <i className="fa fa-folder-open-o sidebar-icon" aria-hidden="true"></i>Project #1
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <i className="fa fa-folder-open-o sidebar-icon" aria-hidden="true"></i>Project #2
                    </a>
                  </li>
                </ul>
              </div>

                <div className="col-lg-8 col-lg-offset-2 col-md-10">
                    <div className="search">
                      <form name="sentMessage" id="contactForm" noValidate>
                          <div className="row control-group">
                              <div className="form-group col-xs-12 floating-label-form-group controls">
                                  <label>Search</label>
                                  <input type="text" className="form-control" placeholder="Search..." id="search" required data-validation-required-message="Please enter your name." />
                                  <p className="help-block text-danger"></p>
                              </div>
                          </div>
                      </form>
                    </div>
                    {articles}
                    <ul className="pager">
                        <li className="next">
                            <a href="#">Older Posts &rarr;</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <hr></hr>
      </div>
		);
  }
}

export default Likes;
