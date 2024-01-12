import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';


function App() {


  return (
    <>
      <nav>
        <div className="navigation-link-group">
          <Link className="page-link" to="/">Home</Link>
          <Link className="page-link" to="/albums">Edit Albums</Link>
          <Link className="page-link" to="/photos">Edit Photos</Link>
        </div>
        <Outlet />
      </nav>
    </>
  );
}

export default App;
