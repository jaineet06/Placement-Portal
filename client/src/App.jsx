import Login from "./components/Login.jsx";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import StudentLayout from "./pages/StudentLayout.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";

const App = () => {
  const { showUserLogin } = useAppContext();
  return (
    <div>
      <Toaster />
      {showUserLogin && <Login />}
      <Routes>
        <Route path="/*" element={<StudentLayout />}>
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
