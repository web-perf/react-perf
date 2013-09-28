/** @jsx React.DOM */

var SearchBox = React.createClass({
  handleSubmit: function() {
    var term = this.refs.searchTerm.getDOMNode().value.trim();
    if (!term) {
      return false;
    }
    this.props.onSearch(term);
    return false;
  },
  render: function() {
    return (
      <form class="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Search component" ref="searchTerm" />
        <input type="submit" value = "search" />
      </form>
    );
  }
});

var 

var App = React.createClass({
	handleSearch : function(search){
		this.state.searchTerm = search;
	},
	handleMetric : function(metric){
		this.state
	},
	render: function() {
		return (
		  <div class="commentList">
		  	<SearchBox onSearch={this.handleSearch}/>
		  </div>
		);
	}
});

React.renderComponent(
  <App/>,
  document.getElementById('content')
);