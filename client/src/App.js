import './App.css';
import {Route, Link} from "react-router-dom";
import login from "./components/login/login";
import register from "./components/login/register";
import splash from "./components/login/splash";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <section className="header">
      <Route exact path="/" component={splash}></Route>
      <Route exact path="/register" component={register}></Route>
      <Route exact path="/login" component={login}></Route>
    </section>
  );
}

export default App;
