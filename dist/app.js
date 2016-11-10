var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
var _ = require('underscore');

require('./scss/main.scss');


var App = React.createClass({

    filterItems: function(event){
        var updatedList = this.state.initialItems;
        updatedList = updatedList.filter(function(item){
            return item.toLowerCase().search(
                    event.target.value.toLowerCase()) !== -1;
        });
        this.setState({items: updatedList});
    },

    getInitialState: function(){
        return {
            initialItems: [],
            items: []
        }
    },

    componentWillMount: function(){
        var th = this;
        var arr = [];
        this.serverRequest =
            axios.get(this.props.source)
                .then(function (result) {

                    _(result.data.worksById).each(function(elem, key){
                        arr.push(elem.Title.TitleText);
                    });

                    th.setState({
                        initialItems: arr
                    });
                });
        this.setState({items: arr})
    },

    componentWillUnmount: function () {
        this.serverRequest.abort();
    },

    render: function(){
        return (
            <div className="listContainer">
                <input type="text" placeholder="Search" onChange={this.filterItems}/>
                <List items={this.state.items}/>
            </div>
        )
    }
});

var List = React.createClass({
    render: function(){
        return (
            <ul>
            {
                this.props.items.map(function(item) {
                return <li key={item}>{item.toUpperCase()}</li>
            })
            }
        </ul>
        )
    }
});

ReactDOM.render(<App source="./products.json" />, document.querySelector("#wrapper"));