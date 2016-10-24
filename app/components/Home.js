import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
    HomeActions.getArticles();
    HomeActions.getLikes();
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleLike(id, title) {
    if(this.findLike(id)) {
      var className = ".article-" + this.slugify(title) + " .fa-heart";
      HomeActions.unlike(id, className);
    } else {
      var className = ".article-" + this.slugify(title) + " .fa-heart-o";
      HomeActions.like(id);
    }
  }

  findLike(id) {
    var match = false;
    for(var i = 0; i < this.state.likes.length; i++) {
      if(this.state.likes[i]._id == id) {
        match = true;
        break;
      }
    }
    return match;
  }

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  render() {

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

export default Home;
