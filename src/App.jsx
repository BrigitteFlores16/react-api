import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';


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
  const [showModal, setShowModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then(data => setArticles(data));
  }, [API_URL]);

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
    
    fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
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
    };

  const handleDelete = () => {
    fetch(`${API_URL}/posts/${articleToDelete.id}`, {
      method: 'DELETE'
    })
      .then(() => {
        const newArticles = articles.filter(article => article.id !== articleToDelete.id);
        setArticles(newArticles);
        setShowModal(false);
      })
    };

  const confirmDelete = (article) => {
    setArticleToDelete(article);
    setShowModal(true);
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
    <h2>Crea nuovo dolce</h2>
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
      <div className="m-2">
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
          
       <div className ="form-check ">
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
       <div className=" col-3 ">
          <button type="submit" className="btn btn-primary"> Modifica</button>
          </div>
          
        </form>
        <hr/>
        <div className="card-container row g-3 ">
          <h1 className="mt-5">Dolci e Salato</h1>
          {articles.map((article, articleIndex) => (
          <div key={articleIndex} className="card">
          {article.image && <img src={`${API_URL}${article.image}`} className="card-img" alt={article.name} />}
          <div className="card-body">
           <h5 className="card-title">{article.name}</h5>
            <p className="card-text">{article.description}</p>
            <p className="card-text">{article.published}</p>
            <p className="card-text">Ingredienti: {article.ingredients.join(', ')}</p>
            <div className="button-container">
            <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(article)}><span className="delete">Elimina</span></button>
            </div>
          </div>
          </div>
          ))}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Conferma eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sei sicuro di voler eliminare?</Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
           Annulla
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Elimina
        </Button>
      </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
