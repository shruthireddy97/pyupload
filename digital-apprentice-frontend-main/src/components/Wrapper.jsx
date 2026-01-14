import React from "react";
import { Link } from "react-router-dom";

const Wrapper = ({ children }) => {
  return null
  return (
    <div>
      <nav className="p-4 flex gap-4 border-b">
        <Link to="/">Upload</Link>
        <Link to="/record">Record</Link>
        <Link to="/lessons">Lessons</Link>
      </nav>
      {children}
    </div>
  );
};

export default Wrapper;
