/** @jsx React.DOM */

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
      metric : 'dropped_percent'
    }
  },
  render: function() {
    return (
      <form  class = "form-inline" onSubmit={this.handleSubmit}>
        <div class="row">
          <div class="col-lg-3">
            <input type="text" class="form-control" placeholder="Search for a component .. " ref = "searchTerm"/>
          </div>
          <div class="col-lg-3">
            <input type = "submit" class = "btn btn-primary" value = "Search"/>
          </div>
          <div class="col-lg-4 pull-right">
            <select class = "form-control" ref = "metric" onChange = {this.handleMetric}>
                <option>mean_frame_time</option>
                <option defaultValue>dropped_percent</option>
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
    getStats(this.props.query.term, yxis).then(function(data){
      console.log(data);
      if (data.length !== 0){
         $('#chartDiv').empty();
        drawGraph([data], yxis);
      } else{
        $('#chartDiv').html('<div class = "jumbotron text-center"><p>Component not found. Select a component and the metric from the menu above.</p></div>');
      }
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
        </div>
      )
    }
  }
})

var App = React.createClass({
  getInitialState : function(){
    return {
      metric : '',
      term  : ''
    }
  },
	handleQuery : function(val){
    this.setState(val);
	},
	render: function() {
		return (
		  <div class="row-fluid">
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