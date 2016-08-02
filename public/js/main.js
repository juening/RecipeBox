(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Panel = ReactBootstrap.Panel,
    Accordion = ReactBootstrap.Accordion;
var Button = ReactBootstrap.Button,
    Input = ReactBootstrap.Input;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Modal = ReactBootstrap.Modal;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var ListGroup = ReactBootstrap.ListGroup,
    ListGroupItem = ReactBootstrap.ListGroupItem;

var initialRecipes = [{
  ingredients: ["Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"],
  title: "Pumpkin Pie"
}, {
  ingredients: ["Noodles", "Tomato Sauce", "(Optional) Meatballs"],
  title: "Spaghetti"
}, {
  ingredients: ["Onion", "Pie Crust", "Sounds Yummy right?"],
  title: "Onion Pie"
}];
var allRecipes;

if (localStorage["storedRecipes"]) {
  allRecipes = JSON.parse(localStorage["storedRecipes"]);
} else {
  allRecipes = initialRecipes;
}

var RecipeBox = React.createClass({
  displayName: "RecipeBox",

  getInitialState: function () {
    return {
      loadedRecipes: []
    };
  },
  componentDidMount: function () {
    var recipes;
    if (localStorage["storedRecipes"]) {
      recipes = JSON.parse(localStorage["storedRecipes"]);
    } else {
      recipes = initialRecipes;
    }
    this.setState({
      loadedRecipes: recipes
    });
  },
  //    componentDidUpdate: function(){
  //       this.setState({loadedRecipes: allRecipes})
  //    },
  updateRecipe: function (recipeKey, obj) {
    allRecipes[recipeKey] = obj;
    this.setState({ loadedRecipes: allRecipes });
    var newStoredRecipes = JSON.stringify(allRecipes);
    localStorage.setItem("storedRecipes", newStoredRecipes);
  }, //update recipe setstate
  addRecipe: function (obj) {
    //var allRecipes = JSON.parse(localStorage.getItem("storedRecipes"));
    allRecipes.push(obj);
    this.setState({ loadedRecipes: allRecipes });
    var newStoredRecipes = JSON.stringify(allRecipes);
    localStorage.setItem("storedRecipes", newStoredRecipes);
  }, //add new recipe

  deleteRecipe: function (recipeKey) {
    allRecipes.splice(recipeKey, 1);
    this.setState({ loadedRecipes: allRecipes });
    var newStoredRecipes = JSON.stringify(allRecipes);
    localStorage.setItem("storedRecipes", newStoredRecipes);
    //allRecipes.splice(recipeKey, 1);
    localStorage.setItem("storedRecipes", JSON.stringify(arr));
  },

  render: function () {
    return React.createElement(
      "div",
      { className: "col-sm-6 col-sm-offset-3" },
      React.createElement(RecipeList, { allRecipes: this.state.loadedRecipes, updateRecipes: this.updateRecipe, deleteRecipe: this.deleteRecipe }),
      React.createElement(RecipeAdd, { addRecipe: this.addRecipe })
    );
  }
});

var RecipeList = React.createClass({
  displayName: "RecipeList",

  updateRecipe: function (targetkey, obj) {
    this.props.updateRecipes(targetkey, obj);
  },

  deleteRecipe: function (targetRecipe) {
    this.props.deleteRecipe(targetRecipe);
  },

  render: function () {
    var allRecipes = this.props.allRecipes;
    var deleteRecipe = this.deleteRecipe;
    var updateRecipe = this.updateRecipe;

    // var save = this.props.save;
    // var delete = this.props.delete;
    var RecipesArray = allRecipes.map(function (recipe, index) {
      var id = index;
      return React.createElement(
        Panel,
        { header: recipe.title, eventKey: id, className: "panel panel-primary recipe" },
        React.createElement(RecipeModal, { key: id, Recipe: recipe, id: id, updateRecipe: updateRecipe, deleteRecipe: deleteRecipe })
      );
    });

    return React.createElement(
      Accordion,
      null,
      RecipesArray
    );
  }
});

var RecipeModal = React.createClass({
  displayName: "RecipeModal",

  getInitialState: function () {
    return {
      showModal: false,
      title: '',
      ingredients: []
    };
  },
  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },
  onTitleChange: function (e) {
    this.setState({ title: e.target.value });
  },
  onIngredChange: function (e) {
    this.setState({ ingredients: e.target.value });
  },
  delete: function () {
    var index = this.props.id;
    this.props.deleteRecipe(index);
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var index = this.props.id;
    var newTitle = this.state.title.trim();
    var newIngred = this.state.ingredients.trim().split(",");
    var newRecipe = { title: newTitle, ingredients: newIngred };
    this.props.updateRecipe(index, newRecipe);
    this.setState({ title: '', ingredients: [] });
    this.close();
  },

  render: function () {
    var recipe = this.props.Recipe;
    var id = this.props.id;
    var index = id - 1;
    var titleId = "title" + id;
    var ingredId = "ingred" + id;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h4",
        null,
        "Ingredients"
      ),
      React.createElement(
        "p",
        null,
        recipe.ingredients.join(', ')
      ),
      React.createElement(
        Button,
        { bsStyle: "primary", bsSize: "sm", onClick: this.open },
        "Edit Recipe"
      ),
      React.createElement(
        Button,
        { bsStyle: "danger", bsSize: "sm", onClick: this.delete },
        "Delete Recipe"
      ),
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.close },
        React.createElement(
          Modal.Header,
          { closeButton: true },
          React.createElement(
            Modal.Title,
            null,
            recipe.title
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(
            "form",
            { onSubmit: this.handleSubmit },
            React.createElement(
              "label",
              { "for": "RecipeTitle" },
              "Recipe Title"
            ),
            React.createElement("br", null),
            React.createElement("input", { onChange: this.onTitleChange, type: "text", defaultValue: recipe.title, id: titleId }),
            React.createElement("br", null),
            React.createElement(
              "label",
              { "for": "RecipeIngred" },
              "Ingredients"
            ),
            React.createElement("br", null),
            React.createElement("textarea", { onChange: this.onIngredChange, defaultValue: recipe.ingredients.join(', '), type: "text", id: ingredId, rows: "3", cols: "60" })
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { onClick: this.handleSubmit },
            "Save"
          ),
          React.createElement(
            Button,
            { onClick: this.close },
            "Close"
          )
        )
      )
    );
  }
});

var RecipeAdd = React.createClass({
  displayName: "RecipeAdd",

  getInitialState: function () {
    return {
      ingredients: [],
      title: ''
    };
  }, //getInitialState
  onTitleChange: function (e) {
    this.setState({ title: e.target.value });
  },
  onIngredChange: function (e) {
    this.setState({ ingredients: e.target.value });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var ingred = this.state.ingredients.trim().split(",");
    var newTitle = this.state.title;
    var newRecipe = { ingredients: ingred, title: newTitle };
    this.setState(newRecipe);
    this.props.addRecipe(newRecipe);
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "panel panel-primary" },
      React.createElement(
        "div",
        { className: "panel-heading" },
        React.createElement(
          "h3",
          null,
          "Add New Recipe"
        )
      ),
      React.createElement(
        "div",
        { className: "panel-body" },
        React.createElement(
          "form",
          { onSubmit: this.handleSubmit },
          React.createElement(
            "h4",
            null,
            "Recipe Title"
          ),
          React.createElement("input", { onChange: this.onTitleChange, value: this.state.title, className: "form-control" }),
          React.createElement(
            "h4",
            null,
            "Recipe Ingredients"
          ),
          React.createElement("textarea", { onChange: this.onIngredChange, value: this.state.ingredients, className: "form-control" }),
          React.createElement(
            "button",
            { className: "btn btn-primary" },
            "Add Recipe"
          )
        )
      )
    );
  }

});

ReactDOM.render(React.createElement(RecipeBox, null), document.getElementById('recipebox'));

},{}]},{},[1]);
