import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Post from "./pages/Post";
import Album from "./pages/Album";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/album/:id" element={<Album />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
