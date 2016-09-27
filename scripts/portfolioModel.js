function Article(opts) {
  this.title = opts.title;
  this.category = opts.category;
  this.publishedOn = opts.publishedOn;
  this.body = opts.body;
}

Article.all = []; // initialize class variable 'all' to an empty list

Article.prototype.toHtml = function () {
  // DONE: Render to HTML using Handlebars template
  /*
    1. Get the article Handlbars template using jQuery
    2. Compile the template using Handlebars
    3. Generate the HTML by calling te template function on this article's data-category
  */
  var source = $('#project-template').html();
  var template = Handlebars.compile(source);
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'posted ' + this.daysAgo + ' days ago' : '(unpublished)';
  var html = template(this);
  return html;
};

Article.loadAll = function(articlesData) {
  articlesData.sort(function(curArticle, nextArticle) {
    return (new Date(nextArticle.publishedOn)) - (new Date(curArticle.publishedOn));
  }).forEach(function(article) {
    Article.all.push(new Article(article));
  });
};

Article.fetchAll = function() {
  if (localStorage.articlesData) {
    // TODO: load articles data from localStorage
    Article.loadAll(JSON.parse(localStorage.articlesData));
    portfolioView.renderIndexPage();
  } else {
    // TODO: get articles data from "server" (JSON file)
    $.getJSON('data/articles.json', function(data, status, xhr) {
      localStorage.setItem('articlesData', xhr.responseText);
      Article.loadAll(JSON.parse(localStorage.articlesData));
      portfolioView.renderIndexPage();
    }).fail(function() {
      console.alert('Failed to get JSON file');
    });
  }
};
