var Panel = ReactBootstrap.Panel, Accordion = ReactBootstrap.Accordion;
var Button = ReactBootstrap.Button, Input = ReactBootstrap.Input;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Modal = ReactBootstrap.Modal;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var ListGroup = ReactBootstrap.ListGroup,ListGroupItem = ReactBootstrap.ListGroupItem;



var initialRecipes = [
   {
      ingredients: ["Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"],
      title: "Pumpkin Pie"
  },
   {
      ingredients: ["Noodles", "Tomato Sauce", "(Optional) Meatballs"],
      title: "Spaghetti"
  },
   {
      ingredients: ["Onion", "Pie Crust", "Sounds Yummy right?"],
      title: "Onion Pie"
  }
];
var allRecipes;

if(localStorage["storedRecipes"]){
  allRecipes = JSON.parse(localStorage["storedRecipes"]);
} else {
  allRecipes = initialRecipes;
}


var RecipeBox = React.createClass({
    getInitialState: function(){
        return {
            loadedRecipes: []
        }
    },
    componentDidMount: function(){
      var recipes;
      if(localStorage["storedRecipes"]){
        recipes = JSON.parse(localStorage["storedRecipes"]);
      } else  {
        recipes = initialRecipes;
      }
      this.setState({
        loadedRecipes: recipes
      });
    },
//    componentDidUpdate: function(){
//       this.setState({loadedRecipes: allRecipes})
//    },
    updateRecipe: function(recipeKey, obj){
      allRecipes[recipeKey] = obj;
      this.setState({loadedRecipes:allRecipes});
      var newStoredRecipes = JSON.stringify(allRecipes);
      localStorage.setItem("storedRecipes",  newStoredRecipes);
    },//update recipe setstate
    addRecipe: function(obj){
      //var allRecipes = JSON.parse(localStorage.getItem("storedRecipes"));
      allRecipes.push(obj);
      this.setState({loadedRecipes:allRecipes});
      var newStoredRecipes = JSON.stringify(allRecipes);
      localStorage.setItem("storedRecipes",  newStoredRecipes);
    },//add new recipe

    deleteRecipe: function(recipeKey){
      allRecipes.splice(recipeKey, 1);
      this.setState({loadedRecipes:allRecipes});
      var newStoredRecipes = JSON.stringify(allRecipes);
      localStorage.setItem("storedRecipes",  newStoredRecipes);
      //allRecipes.splice(recipeKey, 1);
      localStorage.setItem("storedRecipes", JSON.stringify(arr));
    },

    render: function(){
        return (
          <div className="col-sm-6 col-sm-offset-3">
              <RecipeList allRecipes = {this.state.loadedRecipes} updateRecipes = {this.updateRecipe} deleteRecipe = {this.deleteRecipe}/>
              <RecipeAdd addRecipe={this.addRecipe} />
          </div>
        );
    }
});


var RecipeList = React.createClass({
  updateRecipe: function(targetkey, obj){
    this.props.updateRecipes(targetkey, obj);
  },

  deleteRecipe: function(targetRecipe){
    this.props.deleteRecipe(targetRecipe);
  },

  render: function(){
      var allRecipes = this.props.allRecipes;
      var deleteRecipe = this.deleteRecipe;
      var updateRecipe = this.updateRecipe;

      // var save = this.props.save;
      // var delete = this.props.delete;
      var RecipesArray = allRecipes.map(function(recipe, index){
        var id = index;
        return (<Panel header={recipe.title} eventKey={id} className="panel panel-primary recipe">
                  <RecipeModal key={id}  Recipe ={recipe} id = {id} updateRecipe={updateRecipe} deleteRecipe = {deleteRecipe}  />
               </Panel>);
      });

      return (
          <Accordion>
            {RecipesArray}
          </Accordion>
      );
  }
});


var RecipeModal = React.createClass({
   getInitialState: function(){
        return {
            showModal: false,
            title:'',
            ingredients:[]
        }
    },
    close() {
      this.setState({ showModal: false });
    },

    open() {
      this.setState({ showModal: true });
    },
    onTitleChange: function(e){
      this.setState({title: e.target.value});
    },
    onIngredChange: function(e){
      this.setState({ingredients: e.target.value});
    },
    delete: function(){
      var index = this.props.id;
      this.props.deleteRecipe(index);
    },
    handleSubmit: function(e){
      e.preventDefault();
      var index = this.props.id;
      var newTitle = this.state.title.trim();
      var newIngred = this.state.ingredients.trim().split(",");
      var newRecipe = {title:newTitle, ingredients: newIngred};
      this.props.updateRecipe(index, newRecipe);
      this.setState({title: '', ingredients: []});
      this.close();
    },

    render: function(){
      var recipe = this.props.Recipe;
      var id = this.props.id;
      var index = id - 1;
      var titleId = "title" + id;
      var ingredId = "ingred" + id;
      return (
          <div>
           <h4>Ingredients</h4>
           <p>{recipe.ingredients.join(', ')}</p>

            <Button bsStyle="primary"  bsSize="sm"  onClick={this.open} >
              Edit Recipe
            </Button>
            <Button bsStyle="danger"  bsSize="sm"  onClick={this.delete} >
              Delete Recipe
            </Button>

            <Modal show={this.state.showModal} onHide={this.close}>
              <Modal.Header closeButton>
                <Modal.Title>{recipe.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={this.handleSubmit}>
                  <label for="RecipeTitle">Recipe Title</label><br/>
                  <input onChange={this.onTitleChange} type="text" defaultValue={recipe.title} id={titleId} />
                  <br />
                  <label for="RecipeIngred">Ingredients</label><br/>
                  <textarea onChange={this.onIngredChange} defaultValue={recipe.ingredients.join(', ')} type="text" id={ingredId} rows="3" cols="60"></textarea>
                </form>

              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleSubmit}>Save</Button>

                <Button onClick={this.close}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
    )
  }
});


var RecipeAdd = React.createClass({
  getInitialState: function(){
    return {
      ingredients:[],
      title:''
    }
  },//getInitialState
  onTitleChange: function(e){
    this.setState({title: e.target.value});
  },
  onIngredChange: function(e){
    this.setState({ingredients: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    var ingred = this.state.ingredients.trim().split(",");
    var newTitle = this.state.title;
    var newRecipe = {ingredients: ingred, title: newTitle};
    this.setState(newRecipe);
    this.props.addRecipe(newRecipe);
  },
  render:function(){
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3>Add New Recipe</h3>
        </div>
        <div className="panel-body">
            <form onSubmit={this.handleSubmit}>
              <h4>Recipe Title</h4>
              <input onChange={this.onTitleChange} value={this.state.title} className="form-control"/>
               <h4>Recipe Ingredients</h4>
              <textarea onChange={this.onIngredChange} value={this.state.ingredients} className="form-control"></textarea>
              <button className="btn btn-primary">Add Recipe</button>
            </form>
        </div>
      </div>
    )
  }


});



ReactDOM.render(<RecipeBox />, document.getElementById('recipebox'));
