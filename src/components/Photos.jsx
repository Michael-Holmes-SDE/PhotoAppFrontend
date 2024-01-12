import React, { useState, useEffect, useRef } from 'react';
import cookie from "cookie";
import '../App.css';

function Photos() {
  const [keyword, setKeyword] = useState("");
  const [photos, setPhotos] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [tempPhotos, setTempPhotos] = useState([]);
  const addPhotoForm = useRef();


  useEffect(() => {
    getPhotos();
  }, [])


  const handleCheckboxChange = (photoId) => {
    setSelectedPhotos((prevSelected) => {
      if (prevSelected.includes(photoId)) {
        return prevSelected.filter((id) => id !== photoId);
      } else {
        return [...prevSelected, photoId];
      }
    });
  };


  async function createPhoto(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("keywords", keyword);

    for (const photo of tempPhotos) {
      formData.append("photos", photo);
    }
    const res = await fetch("/registration/photos/", {
      method: "post",
      credentials: "same-origin",
      body: formData,
      headers: {
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken
      }
    })
    getPhotos();
    setTempPhotos([]);
    setKeyword('');
    addPhotoForm.current.reset();//Needed to reset file field
  }


  async function getPhotos() {
    const res = await fetch("/registration/photos/", {
      credentials: "same-origin"
    })
    const body = await res.json();
    setPhotos(body.photos);
  }


  async function deletePhoto(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("keywords", keyword);

    for (const photo of selectedPhotos) {
      formData.append("photos", photo);
    }

    const res = await fetch("/registration/photos/delete/", {
      method: "post",
      credentials: "same-origin",
      body: formData,
      headers: {
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken
      }
    })
    getPhotos();
    setSelectedPhotos([]);
    setSearchKeyword('');
  }

  return (
    <>
      <div className="edit-block">
        <form ref={addPhotoForm} onSubmit={createPhoto} className="new-photo-form">
          <h2 className="input-descriptor">Add Photos</h2>
          <input type="file" accept="image/*" onChange={e => setTempPhotos(e.target.files)} multiple />
          <input type="text" className="text-input" value={keyword} placeholder="Keyword (optional)" onChange={e => setKeyword(e.target.value)}/>
          <button disabled={!tempPhotos || tempPhotos.length === 0}>Save Photos</button>
        </form>
      </div>


      <div className="edit-block">
        <form onSubmit={deletePhoto} className="new-photo-form">
          <h2 className="input-descriptor">Remove Photos</h2>
          <input type="text" className="text-input" value={searchKeyword} placeholder="Search photos by keyword" onChange={e => setSearchKeyword(e.target.value)} />
          <div className="photo-display">
            {photos.map(photo => (

              (photo.keyword.startsWith(searchKeyword) || searchKeyword.length === 0) && (
                <div className="item-check-pair" key={photo.id}>
                  <input
                    type="checkbox"
                    id={`photo-${photo.id}`}
                    checked={selectedPhotos.includes(photo.id)}
                    onChange={() => handleCheckboxChange(photo.id)}
                  />
                  <label htmlFor={`photo-${photo.id}`}>
                    <img src={`registration/photoStorage/${photo.id}`}  alt={`Photo ${photo.id}`} className="photo"/>
                  </label>
                </div>
              )
            ))}
          </div>
          <button disabled={selectedPhotos.length === 0}>Delete Selected Photos</button>
          <button className="red-button" disabled={photos.length === 0} onClick={() => setSelectedPhotos(photos.map(photo => photo.id))}>Delete ALL Photos</button>
        </form>
      </div>
    </>
  );
}

export default Photos;
