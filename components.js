/** @jsx React.DOM */

var Server = React.createClass({
  changeServer: function(){
    this.props.onServer({server: this.refs.server.getDOMNode().value.trim()})
  },
  render: function(){
    return (
      <div class="row">
        <div class="col-lg-4">
          <select class = "server-select span3 form-control" ref = "server" onChange={this.changeServer}>
            <option>http://localhost:5984/</option>
            <option>http://axemclion.iriscouch.com/</option>
          </select>
        </div>
      </div>
    )
  }
});

var Query = React.createClass({
  handleSubmit: function() {
    var val = this.refs.searchTerm.getDOMNode().value.trim();
    if (val) {
      this.setState({term:val}, function(){
         this.props.onQuery(this.state); 
      });
    }
    return false;
  },
  handleMetric : function(){
    var val = this.refs.metric.getDOMNode().value.trim();
    console.log("Metric changed to %s", val);
    if (val) {
      this.setState({metric:val}, function(){
        this.props.onQuery(this.state);  
      });
    }
  },
  getInitialState: function(){
    return {
      metric : 'mean_frame_time'
    }
  },
  render: function() {
    return (
      <form  class = "form-inline" onSubmit={this.handleSubmit}>
        <div class="row">
          <div class="col-lg-4">
            <input type="text" class="form-control" placeholder="Component name (message, chart ... )" ref = "searchTerm"/>
          </div>
          <div class="col-lg-3">
            <input type = "submit" class = "btn btn-primary" value = "Search"/>
          </div>
          <div class="col-lg-4 pull-right">
            <select class = "form-control" ref = "metric" onChange = {this.handleMetric}>
                <option defaultValue>mean_frame_time</option>
                <option>dropped_percent</option>
                <option>total_texture_upload_time</option>
                <option>dom_content_loaded_time_ms</option>
                <option>average_commit_time</option>
                <option>total_texture_upload_time</option>
            </select>
          </div>
        </div>      
      </form>
    );
  }
});

var Graph = React.createClass({
  getData : function(){
    var yxis = this.props.query.metric;
    getStats(this.props.query.server, this.props.query.term, yxis).then(function(data){
      console.log(data);
      if (data.length !== 0){
         $('#chartDiv').empty();
        drawGraph([data], yxis);
      } else{
        $('#chartDiv').html('<div class = "jumbotron text-center"><p>Component not found. Select a component and the metric from the menu above.</p></div>');
      }
    }, function(){
      $('#chartDiv').html('<div class = "jumbotron text-center"><p>An error occured while trying to get data. Please try again</p></div>');
    });
  },
  render : function(){
    if (!this.props.query.term || !this.props.query.metric){
      return (
        <div id = "chartDiv">
          <div class = "jumbotron text-center">
            <p>Select a component and the metric from the menu above.</p>
          </div>
        </div>
        )
    } else {
      this.getData();
      return (
        <div id = "chartDiv">
          <div class = "jumbotron text-center">
            <p>Loading ... </p>
          </div>
        </div>
      )
    }
  }
})

var App = React.createClass({
  getInitialState : function(){
    return {
      metric : '',
      term  : '',
      server: 'http://localhost:5984/'
    }
  },
	handleQuery : function(val){
    console.log("Changing state", val)
    this.setState(val);
	},
	render: function() {
		return (
		  <div class="row-fluid">
          <Server onServer={this.handleQuery}/>
		  	  <Query onQuery={this.handleQuery}/>
          <Graph query = {this.state}/>
      </div>
		);
	}
});

React.renderComponent(
  <App/>,
  document.getElementById('content')
);
