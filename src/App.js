import { useState } from 'react'
import './App.css' // everything on App.css is Claude-generated, I let it handle styling entirely
// I did make tweaks with re-prompting and going in to change individual styling blocks

// In general, I frequently interfaced with Claude for debugging tips, though I attempted to make most of
// the changes myself and re-ask the question when I didn't understand a suggestion (ex. advanced error handling)

const App = () => {
  return (
    <div className="app-container">
      <BookSearch />
    </div>
  )
};

const BookSearch = () => {
  // set up a whole bunch of dynamic variables
  const [searchTerm, setSearchTerm] = useState('')
  const [imageUrl, setImageUrl] = useState(``)
  const [bookTitle, setBookTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [wantToReadList, setWantToReadList] = useState([])
  const [dontWantToReadList, setDontWantToReadList] = useState([])
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value) // make search box update dynamically
  }
  const handleSearch = async () => {
    const formattedSearchTerm = searchTerm.replaceAll(" ", "_") // get search term ready to be passed to API
    const API_URL = `https://openlibrary.org/search.json?title=${formattedSearchTerm}&lang=en&limit=1&fields=cover_edition_key,title,author_name`
    const response = await fetch(API_URL)
    const data = await response.json() // gets API response
    if (!data.docs || data.docs.length === 0) {
      alert("No books found. Please try another search term."); // Pop-up if no books are found. Claude suggested "alert"
      return;
    }
    setAuthor(data.docs[0].author_name)
    setBookTitle(data.docs[0].title)
    const key = data.docs[0].cover_edition_key
    const newImageUrl = `https://covers.openlibrary.org/b/olid/${key}-L.jpg` // uses OpenLibrary ID to search for cover URL
    setImageUrl(newImageUrl) // sets image URL to be displayed to the one showing book's cover
  }
  // adds given title to the "want to read" list. Claude provided the ... notation
  const handleWantToRead = (title) => {
    setWantToReadList([...wantToReadList, title]); 
  }
  //same thing but "don't want to read" list
  const handleDontWantToRead = (title) => {
    setDontWantToReadList([...dontWantToReadList, title]);
  }
  // displays core components of app. Claude helped with the <ul> and <li> tagging system
  return (
    <div>
        <h1>Judge a book by its cover!</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
          placeholder="Book Title"
          />
        <button onClick={handleSearch}>Search</button>
        <BookDisplay imageUrl={imageUrl} title={bookTitle} author={author} onWantToRead={handleWantToRead} onDontWantToRead={handleDontWantToRead} />
        <div>
        <h3>Want to Read:</h3>
        
        <ul>
          {wantToReadList.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
        <h3>Don't Want to Read:</h3>
        <ul>
          {dontWantToReadList.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
      </div>
      </div>
  );
};

const BookDisplay = ({ imageUrl, title, author, onWantToRead, onDontWantToRead }) => {
  // Component to display the book searched for by the user. Claude helped w/ the conditional syntax
  return (
    <div>
    <p>Wanna read it?</p>
    {imageUrl ? (
      <>
        <img 
          src={imageUrl}
          alt={title}
          style={{ maxWidth: '300px' }}
          />
          <p>{title} by {author}</p>
          <div>
            <button onClick={() => onWantToRead(title)}>Want to Read</button>
            <button onClick={() => onDontWantToRead(title)}>Don't Want to Read</button>
          </div>
          </>
          ) : (
            <p>Search for a book to see its cover</p>
          )}
    
    </div>
  )
}

export default App;
