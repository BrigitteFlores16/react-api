import { useState, useEffect } from 'react';

function App() {
  const IngredientsList = ['zucchero', 'farina', 'uova', 'lievito'];
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    ingredients: [],
    published: false,
  });
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/posts')
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'ingredients') {
      const newIngredients = checked
        ? [...formData.ingredients, value]
        : formData.ingredients.filter(ingredient => ingredient !== value);
      setFormData({
        ...formData,
        ingredients: newIngredients
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      alert("Completa tutti i campi");
      return;
    }
    
    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        setArticles([...articles, data]);
        setFormData({
          name: '',
          image: '',
          description: '',
          ingredients: [],
          published: false,
        });
      })
      .catch(error => console.error('Errore nell\'invio dei dati:', error));
  };

  const deleteArticle = (articleIndex) => {
    const articleToDelete = articles[articleIndex];
    fetch(`http://localhost:3000/posts/${articleToDelete.id}`, {
      method: 'DELETE'
    })
      .then(() => {
        const newArticles = [...articles];
        newArticles.splice(articleIndex, 1);
        setArticles(newArticles);
      })
     };

  const editArticle = (articleIndex) => {
    const newName = prompt('Modifica il nome:', articles[articleIndex].name);
    if (newName) {
      const newArticles = articles.map((article, i) =>
        i === articleIndex ? { ...article, name: newName } : article
      );
      setArticles(newArticles);
    }
  };

  return (
    <>
    <div className="container">
     <h1>Crea nuovo dolce</h1>
    <form onSubmit={handleFormSubmit} className="row g-3">
          
    <div className="col-3">
    <label htmlFor="name" className="form-label">
       Nome
    </label>
    <input
    type="text"
    className="form-control"
    name="name"
    value={formData.name}
    onChange={handleInputChange}
    />
    </div>
    <div className="col-3">
    <label htmlFor="description">
      Descrizione
    </label>
     <textarea
    type="text"
    className="form-control"
    name="description"
    value={formData.description}
    onChange={handleInputChange}></textarea>
     </div>

    <div className="col-3">
    <label htmlFor="image" className="form-label">
      Immagine
    </label>
    <input
      type="text"
      className="form-control"
      name="image"
      value={formData.image}
      onChange={handleInputChange}
    />
    </div>
      <div className="mb-2">
      <label htmlFor="name" className="form-label">
         Ingredienti:
     </label>
      {IngredientsList.map(tag => (
      <div key={tag} className="form-check">
       <input
        type="checkbox"
        name="ingredients"
        value={tag}
       checked={formData.ingredients.includes(tag)}
        onChange={handleInputChange}
        className="form-check-input"
        />
        <label className="form-check-label">{tag}</label>
        </div>
        ))}
       </div>
          
       <div className ="col-3">
         <input type="checkbox" 
         name="published"
          checked={formData.published}
           onChange={handleInputChange} 
           className="form-check-input" 
           />
            <label htmlFor="published" className="form-check-label">
              Pubblica
              </label>
            </div>
       
      
        <div className="col-3">
          <button type="submit" className="btn btn-primary">Aggiungi Articolo</button>
          </div>
        </form>
        <hr/>
        
        <div className="container">
          < h1 className="mt-5">Dolci e Salato</h1>
           {articles.map((article, articleIndex) => (
            <div key={articleIndex} className="card" >
              {article.image && <img src={`http://localhost:3000${article.image}`} className="card-img-top" alt={article.name} />}
              <div className="card-body">
             <h5 className="card-title">{article.name}</h5>
              <p className="card-text">{article.description}</p>
              <p className="card-text">{article.published}</p>
              <p className="card-text">Ingredienti: {article.ingredients.join(', ')}</p>
              <div className="button-container">
              <button className="btn btn-warning btn-sm me-2" onClick={() => editArticle(articleIndex)}>Modifica</button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteArticle(articleIndex)}><span className="material-symbols-outlined">delete</span></button>
             </div>
           </div>
         </div>
        ))}
      </div>
    </div>
   </>
 );
}

export default App;
