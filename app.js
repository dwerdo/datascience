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

		this.props.ingredients.forEach(function(ingredient) {
			list.push(<Ingredient ingredient={ingredient} />);
		});
		return (
			<ul>
				{list}
			</ul>
		);
	}
});

var RecipeTable = React.createClass({

	addRemoveRecipe: function(checked, recipe) {
		this.props.updateSelectedRecipes(checked, recipe);
	},

    render: function() {
        var rows = [];
        
        this.props.recipes.forEach(function(recipe) {        	
        	if(recipe.ingredients.indexOf(this.props.filterText) === -1) {
        		return;
        	} else {
        		rows.push(<RecipeRow recipe={recipe} onRecipeChecked={this.addRemoveRecipe} />);	
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
			selectedRecipes: [],
			ingredients: ["Rice", "Chicken Stock", "Parmesan Cheese", "White Wine", "Butter", "Salt", "Pepper", "Peas"]
		};
	},

	handleUserInput: function(filter, checkbox) {
		this.setState({
			filterText: filter
		});
	},

	updateSelectedRecipes: function(checked, recipe) {
		Array.prototype.removeRecipe = function(recipe) {
			var index = this.indexOf(recipe);
			if(index > 0) {
				this.splice(index, 1);
			}
		}

		if(checked) {
				this.state.selectedRecipes.push(recipe);
		} else {
			this.state.selectedRecipes.removeRecipe(recipe);
		}
		console.log('selected recipes: ' + this.state.selectedRecipes);
		this.updateIngredients(this.state.selectedRecipes);

	},

	updateIngredients: function(arr) {
		console.log('arr: ', arr);
		this.setState({ingredients: null});
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

		this.props.recipes.forEach(function(recipe) {

			if(arr.indexOf(recipe.name) >= 0) {
				console.log('in the list', arr, recipe);
		
				this.setState({
					ingredients: this.state.ingredients.concat(recipe.ingredients).unique()
				});
			} else {
				console.log(arr.indexOf(recipe.name));
			}
		}.bind(this));

		console.log('this is state.ingredients: ' + this.state.ingredients);
		
		
		
	},

    render: function() {
        return (
            <div className="app clearfix">
            	<h1>Cook Me Something to Eat!</h1>
            	<div className="main-content clearfix">
	                <div className="left table-container">
	                	<SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput} />
	                	<RecipeTable filterText={this.state.filterText} recipes={this.props.recipes} updateSelectedRecipes={this.updateSelectedRecipes} />
	            	</div>
	                <div className="left table-container ingredients-list"><IngredientsList ingredients={this.state.ingredients}/></div>
                </div>
            </div>
        );
    }
});


var PRODUCTS = [
    {
        "name": "Risotto",
        "type": "Italian",
        "cook_time": 60,
        "ingredients": ["Rice", "Chicken Stock", "Parmesan Cheese", "White Wine", "Butter", "Salt", "Pepper", "Peas"]
    },
    {
        "name": "Enchiladas",
        "type": "Mexican",
        "cook_time": 50,
        "ingredients": ["Tomato Sauce", "Tomato", "Corn Tortillas", "Cheddar Cheese", "Onion", "Olives", "Salt", "Chicken"]
    },
    {
        "name": "Hummus",
        "type": "Middle Eastern",
        "cook_time": 10,
        "ingredients": ["Garlic", "Chickpeas", "Salt", "Tahini", "Hot Sauce"]
    },
    {
        "name": "Pancakes",
        "type": "Breakfast",
        "cook_time": 25,
        "ingredients": ["Milk", "Flour", "Sugar", "Butter", "Baking Powder", "Baking Soda", "Egg", "Salt"]
    },
    {
        "name": "Borscht",
        "type": "Russian",
        "cook_time": 75,
        "ingredients": ["Water", "Potato", "Beets", "Butter", "Onion", "Salt", "Celery", "Carrot", "Cabbage", "Pepper", "Vinegar", "Tomato"]
    },
    {
        "name": "Pierogi",
        "type": "Polish",
        "cook_time": 105,
        "ingredients": ["Butter", "Onion", "Salt", "Pepper", "Potato", "Egg", "Flour", "Baking Powder"]
    },
    {
        "name": "Pupusa",
        "type": "Salvadoran",
        "cook_time": 40,
        "ingredients": ["Masa", "Water", "Queso Fresco"]
    },
    {
        "name": "Fried Rice",
        "type": "Chinese",
        "cook_time": 28,
        "ingredients": ["Onion", "Oil", "Rice", "Egg", "Soy Sauce", "Sesame Oil", "Chicken", "Carrot", "Peas"]
    }
];
 
React.render(<FilterableRecipeTable recipes={PRODUCTS} />, document.body);
