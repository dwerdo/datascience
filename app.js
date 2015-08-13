Array.prototype.unique = function() {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i+1; j < a.length; ++j) {
            if (a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }
    return a;
};

Array.prototype.removeRecipe = function(recipe) {
    var index = this.indexOf(recipe);
    if(index >= 0) {
        this.splice(index, 1);
    }
}

var RecipeRow = React.createClass({
	handleChange: function() {
		this.props.onRecipeChecked(
			this.refs.recipeCheckBox.getDOMNode().checked, this.props.recipe.name
		);
	},
    render: function() {
        return (
            <tr>
                <td>{this.props.recipe.name}</td>
                <td><input type="checkbox" ref="recipeCheckBox" onChange={this.handleChange} /></td>
            </tr>
        );
    }
});

var SearchBar = React.createClass({
	
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value
        );
    },
    render: function() {
        return (
            <form>
                <input type="text" placeholder="Ingredients Search..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange} />
            </form>
        );
    }
});

var Ingredient = React.createClass({
	
    render: function() {
		return(
			<li>{this.props.ingredient}</li>
		);
	}
});

var IngredientsList = React.createClass({
	
    render: function() {
		var list = [];
		this.props.ingredients.forEach(function(ingredient, index) {
			list.push(<Ingredient key={index} ingredient={ingredient} />);
		});

		return (
            <div>
                <b>Ingredients List:</b>
    			<ul>
    				{list}
    			</ul>
            </div>
		);
	}
});

var RecipeTable = React.createClass({
    
    addRemoveRecipe: function(checked, recipe) {
        if(checked) {
            this.props.selectedRecipes.push(recipe);
        } else {
            this.props.selectedRecipes.removeRecipe(recipe);
        }

		this.props.updateIngredients(this.props.selectedRecipes);
	},

    render: function() {
        var rows = [];
        
        this.props.recipes.forEach(function(recipe) {        	
        	if(recipe.ingredients.indexOf(this.props.filterText) >= 0) {
                rows.push(<RecipeRow key={recipe.name} recipe={recipe} onRecipeChecked={this.addRemoveRecipe} />);  
        	} else {
        		return;
        	}
        }.bind(this));

        return (
            <table className="recipeTable table">
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

var FilterableRecipeTable = React.createClass({
	
    getInitialState: function() {
		return {
			filterText: '',
			ingredients: ['Select an ingredient!'],
            selectedRecipes: [],
            recipes: []
		};
	},

    componentDidMount: function() {
        $.get(this.props.source, function(result) {
            if (this.isMounted()) {
                this.setState({
                    recipes: result
                });
            }
        }.bind(this));
    },

	onUserInput: function(filter) {
		this.setState({
			filterText: filter,
            ingredients: [],
            selectedRecipes: []
		});
	},

	updateIngredients: function(arr) {

        var currentRecipes = this.state.recipes.filter(function(recipe) {
            return arr.indexOf(recipe.name) >= 0;
        });

        var currentIngredients = currentRecipes.reduce(function(coll, recipe) {
            return coll.concat(recipe.ingredients);
        }, []).unique().sort();

        this.setState({
            ingredients: currentIngredients
        });
	},

    render: function() {
        return (
            <div className="app clearfix">
            	<h1>Cook Me Something to Eat! <img className="hamburger" src="./hamburger.png"/></h1>
            	<div className="main-content clearfix">
	                <div className="left table-container">
	                	<SearchBar filterText={this.state.filterText} onUserInput={this.onUserInput} />
	                	<RecipeTable selectedRecipes={this.state.selectedRecipes} filterText={this.state.filterText} recipes={this.state.recipes} updateIngredients={this.updateIngredients} />
	            	</div>
	                <div className="left table-container ingredients-list"><IngredientsList ingredients={this.state.ingredients}/></div>
                </div>
            </div>
        );
    }
});
 
React.render(<FilterableRecipeTable source='./recipes.json' />, document.body);
