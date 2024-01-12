import React, { useState, useEffect } from 'react';
import cookie from "cookie";
import '../App.css';

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [photos, setPhotos] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [title, setTitle] = useState("");
  
  
  useEffect(() => {
    getAlbums();
    getPhotos();
  }, [])


  const handleCheckboxChangePhotos = (photoId) => {
    setSelectedPhotos((prevSelected) => {
      if (prevSelected.includes(photoId)) {
        return prevSelected.filter((id) => id !== photoId);
      } else {
        return [...prevSelected, photoId];
      }
    });
  };


  const handleCheckboxChangeAlbums = (albumId) => {
    setSelectedAlbums((prevSelected) => {
      if (prevSelected.includes(albumId)) {
        return prevSelected.filter((id) => id !== albumId);
      } else {
        return [...prevSelected, albumId];
      }
    });
  };


  async function createAlbum(e) {
    e.preventDefault();
    const photoIds = selectedPhotos;


    const res = await fetch("/registration/albums/", {
      method: "post",
      credentials: "same-origin",
      body: JSON.stringify({
        title,
        photoIds,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken
      }
    })
    getAlbums();
    setSelectedPhotos([]);
    setKeyword('');
    setTitle('');
  }


  async function getAlbums() {
    const res = await fetch("/registration/albums/", {
      credentials: "same-origin"
    })

    const body = await res.json();
    setAlbums(body.albums);
  }


  async function getPhotos() {
    const res = await fetch("/registration/photos/", {
      credentials: "same-origin"
    })

    const body = await res.json();
    setPhotos(body.photos);
  }


  async function deleteAlbum(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("keywords", keyword);

    for (const album of selectedAlbums) {
      formData.append("albums", album);
    }

    const res = await fetch("/registration/albums/delete/", {
      method: "post",
      credentials: "same-origin",
      body: formData,
      headers: {
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken
      }
    })

    getAlbums();
    setSelectedAlbums([]);
    setSearchTitle('');
  }

  return (
    <>
      <div className="edit-block">
        <h2 className="input-descriptor">Create New Album</h2>
        <form onSubmit={createAlbum} className="new-album-form">
          <input type="text" className="text-input" value={title} placeholder="New Album Title" onChange={e => setTitle(e.target.value)} required />
          <div>
            <h4 className="input-descriptor">Select Photos</h4>
            <input type="text" className="text-input" value={keyword} placeholder="Search photos by keyword" onChange={e => setKeyword(e.target.value)} />
            <div className="photo-display">
              {photos.map(photo => (
                (photo.keyword.startsWith(keyword) || keyword.length === 0) && (
                  <div className="item-check-pair" key={photo.id}>
                    <input
                      type="checkbox"
                      id={`photo-${photo.id}`}
                      checked={selectedPhotos.includes(photo.id)}
                      onChange={() => handleCheckboxChangePhotos(photo.id)}
                    />
                    <label htmlFor={`photo-${photo.id}`}>
                      <img src={`registration/photoStorage/${photo.id}`}  alt={`Photo ${photo.id}`} className="photo"/>
                    </label>
                  </div>
              )
              ))}
            </div>
          </div>
          <button disabled={selectedPhotos.length === 0 || title.length === 0}>Save Album</button>
        </form>
      </div>


      <div className="edit-block">
        <form onSubmit={deleteAlbum} className="new-photo-form">
          <h2 className="input-descriptor">Remove Albums</h2>
          <input type="text" className="text-input" value={searchTitle} placeholder="Search albums by title" onChange={e => setSearchTitle(e.target.value)} />
          <div className="photo-display">
            {albums.map(album => (
              (album.title.startsWith(searchTitle) || searchTitle.length === 0) && (
                <div className="item-check-pair" key={album.id}>
                  <input
                    type="checkbox"
                    id={`album-${album.title}`}
                    checked={selectedAlbums.includes(album.id)}
                    onChange={() => handleCheckboxChangeAlbums(album.id)}
                  />
                  { album.title }
                  {album.photos.length > 0 && (
                    <img
                    src={`registration/photoStorage/${album.photos[0].id}`}
                    alt={`Photo from ${album.title}`}
                    className="album-cover-photo"
                  />
                  )}

                </div>
              )
            ))}
          </div> 
          <button disabled={selectedAlbums.length === 0}>Delete Selected Albums</button>
          <button className="red-button" disabled={albums.length === 0} onClick={() => setSelectedAlbums(albums.map(album => album.id))}>Delete ALL Albums</button>
        </form>
      </div>
    </>
  );
}

export default Albums;
