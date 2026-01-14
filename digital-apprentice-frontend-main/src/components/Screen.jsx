// import React from 'react'
import digitalassesment from "../assets/digitalassesment.png";
import { useNavigate } from "react-router-dom";
const Screen = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200" co>
      <div className="min-w-1/4 h-full bg-white shadow-lg">
        <div
          style={{ backgroundColor: "#FF5A00" }}
          className="h-auto flex justify-center items-center"
        >
          <h1
            style={{ fontSize: "2" }}
            className="text-white font-bold p-2 text-center"
          >
            Digital <br></br> Apprentice
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center p-0">
          <img
            src={digitalassesment}
            alt="digitalassesment"
            className="w-2/3 h-auto mt-0"
          />
        </div>
        <div className="flex flex-col justify-center items-center p-2">
          <div className="w-9/12 h-auto bg-blue-500">
            <div>
              <h1
                className="text-white font-bold p-2 text-center"
                style={{ fontSize: "1.5rem" }}
              >
                User Name{" "}
              </h1>
              <input
                type="text"
                placeholder="Enter User Name"
                className="w-10/12 p-2 mb-2 bg-white  justify-self-center align-middle flex"
              />
            </div>
            <div>
              <h1
                className="text-white font-bold p-2 text-center"
                style={{ fontSize: "1.5rem" }}
              >
                Password
              </h1>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-10/12 p-2 mb-2 bg-white justify-self-center align-middle flex"
              />
            </div>
            <div>
                <div className='flex justify-around items-center p-2'>

        <button type="submit" style={{backgroundColor: "#000000"}} onClick={() => navigate('/signup')} className='text-white font-bold p-2 w-1/3'>Signup</button>
         <button type="submit" style={{backgroundColor: "#FF5A00"}} onClick={() => navigate("/login")} className='text-white font-bold p-2 w-1/3'>Login</button>

    </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen;
