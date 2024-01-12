import { useState, useEffect } from 'react'
import cookie from "cookie"
import '../App.css'

function Home() {
  const [albums, setAlbums] = useState([]);
  const [currentAlbumsIndex, setCurrentAlbumsIndex] = useState(0);
  const [currentPhotosIndex, setCurrentPhotosIndex] = useState(0);
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);


  useEffect(() => {
    getUser();
    getAlbums();
    getPhotos();
  }, [])


  async function getUser() {
    const res = await fetch('/registration/me/', {
      credentials: "same-origin",
    });
    const body = await res.json();
    setUser(body.user);
    setLoading(false);
  }


  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin",
    });

    if (res.ok) {
      window.location = "/registration/sign_in/";
    } else {
    }
  }


  const toggleAlbum = (albumId) => {
    setExpandedAlbum((prevExpandedAlbum) => (prevExpandedAlbum === albumId ? null : albumId));
  };


  async function getAlbums() {
    const res = await fetch("/registration/albums/", {
      credentials: "same-origin"
    })

    const body = await res.json();
    setAlbums(body.albums);
  }

  const displayAlbums = () => {
    const albumsPerPage = 3;
    const startIndex = currentAlbumsIndex * albumsPerPage;
    const endIndex = startIndex + albumsPerPage;
  
    const displayedAlbums = albums.slice(startIndex, endIndex);
  
    return (
      <div>
        {displayedAlbums.map((album) => (
          <div key={album.id} className={`album ${expandedAlbum === album.id ? 'expanded' : ''}`}>
            <div onClick={() => toggleAlbum(album.id)}>
              <h3>{album.title}</h3>
              <div className="photo-display">
                {album.photos.length > 0 && (
                  <img
                    src={`registration/photoStorage/${album.photos[0].id}`}
                    alt={`Photo from ${album.title}`}
                    className="album-cover-photo"
                  />
                )}
                {expandedAlbum === album.id && (
                  <div>
                    {album.photos.slice(1).map((photo) => (
                      <img
                        key={photo.id}
                        src={`registration/photoStorage/${photo.id}`}
                        alt={`Photo ${photo.id}`}
                        className="album-photo"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const handlePrevClickAlbums = () => {
    const prevIndex = (currentAlbumsIndex - 1 + Math.ceil(albums.length / 3)) % Math.ceil(albums.length / 3);
  
    if (prevIndex >= 0) {
      setCurrentAlbumsIndex(prevIndex);
    }
  };
  
  const handleNextClickAlbums = () => {
    const nextIndex = (currentAlbumsIndex + 1) % Math.ceil(albums.length / 3);
  
    if (nextIndex * 3 < albums.length) {
      setCurrentAlbumsIndex(nextIndex);
    }
  };


  async function getPhotos() {
    const res = await fetch("/registration/photos/", {
      credentials: "same-origin"
    })
    
    const body = await res.json();
    setPhotos(body.photos);
  }

  const displayPhotos = () => {
    const startIndex = currentPhotosIndex * 6;
    const endIndex = startIndex + 6;
  
    const filteredPhotos = photos
      .filter((photo) => photo.keyword.toLowerCase().includes(keyword.toLowerCase()));
  
    const displayedPhotos = filteredPhotos.slice(startIndex, endIndex);
  
    return (
      <div>
        {displayedPhotos.map((photo) => (
          <img
            key={photo.id}
            src={`registration/photoStorage/${photo.id}`}
            alt={`Photo ${photo.id}`}
            className="photo"
          />
        ))
        }
      </div>
    );
  };
  

  const handlePrevClickPhotos = () => {
    const prevIndex = (currentPhotosIndex - 1 + Math.ceil(photos.length / 6)) % Math.ceil(photos.length / 6);
    const prevStartIndex = prevIndex * 6;
    const prevEndIndex = prevStartIndex + 6;
  
    const filteredPhotos = photos.filter((photo) =>
      photo.keyword.toLowerCase().includes(keyword.toLowerCase())
    );
  
    const displayedPhotos = filteredPhotos.slice(prevStartIndex, prevEndIndex);
  
    if (displayedPhotos.length > 0) {
      setCurrentPhotosIndex(prevIndex);
    }
  };

  const handleNextClickPhotos = () => {
    const nextIndex = (currentPhotosIndex + 1) % Math.ceil(photos.length / 6);
    const nextStartIndex = nextIndex * 6;
    const nextEndIndex = nextStartIndex + 6;
  
    const filteredPhotos = photos.filter((photo) =>
      photo.keyword.toLowerCase().includes(keyword.toLowerCase())
    );
  
    const displayedPhotos = filteredPhotos.slice(nextStartIndex, nextEndIndex);
  
    if (displayedPhotos.length > 0) {
      setCurrentPhotosIndex(nextIndex);
    }
  };


  return (
    <>
      {loading && <div>Loading...</div>}
      {user && <h2>Hello {user.first_name}!</h2>}
      
      {user && (
        <div className="albums-container">
          <h2>Your Albums</h2>
          <h5>Click to Expand</h5>
          <div>
            {displayAlbums()}
          </div>
          <div className="album-navigation">
            <button onClick={handlePrevClickAlbums}>Previous</button>
            <button onClick={handleNextClickAlbums}>Next</button>
          </div>
        </div>
      )}


      {user && (
        <div className="edit-block">
          <h2>Your Photos</h2>
          <input 
            type="text" 
            className="input-descriptor" 
            value={keyword} 
            placeholder="Search photos by keyword" 
            onChange={e => setKeyword(e.target.value)} 
          />
        <div className="photo-display">
          {displayPhotos()}
        </div>
        <div className="photo-navigation">
          <button onClick={handlePrevClickPhotos}>Previous</button>
          <button onClick={handleNextClickPhotos}>Next</button>
        </div>
      </div>
      )}

      <button className="session-change-button" onClick={logout}>Logout</button>
    </>
  )
}

export default Home;
