import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import NoteState from "./context/notes/NoteState";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Alert from "./components/Alert";
import Login from "./components/Login";
import SignIn from "./components/SignIn";

const App = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
  return (
    <>
      <NoteState>
        <BrowserRouter>
          <Navbar />
          <Alert alert={alert}/>
          <div className="container">
          <Routes>
            <Route exact path="/" element={<Home  showAlert={showAlert}/>} />
            <Route exact path="/login" element={<Login showAlert={showAlert} />} />
            <Route exact path="/signin" element={<SignIn showAlert={showAlert} />} />
          </Routes>
          </div>
        </BrowserRouter>
      </NoteState>
    </>
  );
};

export default App;
