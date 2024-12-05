import { useState, useEffect } from 'react';

function App() {
  const possibleTags = ['HTML', 'CSS', 'JavaScript', 'ExpressJS', 'NodeJS'];
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    image: '',
    content: '',
    category: '',
    published: false,
    tags: []
  });
  const [articles, setArticles] = useState([]);

    fetch('http://localhost:3000/posts')
       .then(res => res.json())
       .then(data => setArticles(data));
  
    const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox' && name === 'tags') {
      const newTags = checked
        ? [...formData.tags, value]
        : formData.tags.filter(tag => tag !== value);
      setFormData({
        ...formData,
        tags: newTags
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : type === 'file' ? URL.createObjectURL(files[0]) : value
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.content || !formData.category) {
      alert("Inserisci tutti i valori");
      return;
    }
    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res=> res.json())
      .then(data => {

    setArticles([...articles, formData]);
    setFormData({
      title: '',
      author: '',
      image: '',
      content: '',
      category: '',
      published: false,
      tags: []
    });
  })
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
    const newTitle = prompt('Modifica il titolo:', articles[articleIndex].title);
    if (newTitle) {
      const newArticles = articles.map((article, i) =>
        i === articleIndex ? { ...article, title: newTitle } : article
      );
      setArticles(newArticles);
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="mt-5">Articoli Blog</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Titolo dell'articolo"
            className="form-control mb-2"
            required
          />
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            placeholder="Autore"
            className="form-control mb-2"
            required
          />
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Contenuto dell'articolo"
            className="form-control mb-2"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-control mb-2"
            required
          >
            <option value="">Seleziona una categoria</option>
            <option value="Categoria1">Categoria1</option>
            <option value="Categoria2">Categoria2</option>
          </select>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label className="form-check-label">Pubblica</label>
          </div>
          <div className="mb-2">
            <label>Tag:</label>
            {possibleTags.map(tag => (
              <div key={tag} className="form-check">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  checked={formData.tags.includes(tag)}
                  onChange={handleInputChange}
                  className="form-check-input"
                />
                <label className="form-check-label">{tag}</label>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary">Aggiungi Articolo</button>
        </form>
        <ul className="list-group mt-3">
          {articles.map((article, articleIndex) => (
            <li key={articleIndex} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                {article.title} - {article.author} 
              </span>
              {article.image && <img src={article.image} alt={article.title} style={{ maxWidth: '100px', maxHeight: '100px' }} />}
              <div className="button-container">
                <button className="btn btn-success btn-sm me-2" onClick={() => editArticle(articleIndex)}>Modifica</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteArticle(articleIndex)}><span className="material-symbols-outlined">delete</span></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
