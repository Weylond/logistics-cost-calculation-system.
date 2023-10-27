import { A } from "@solidjs/router";
import "./styles.css";

function Header() {
  return (
    <header style={{"display":"none"}}>
      <nav>
      <A activeClass="selected" href="/home/" aria-label="Home">
        Xlogistick
      </A>
      <A activeClass="selected" href="/home/" aria-label="Home">
         About us
      </A>
      <A activeClass="selected" href="/home/" aria-label="Home">
        Orders
      </A>
      <A activeClass="selected" href="/home/" aria-label="Home">
        Profile
      </A>
      </nav>    
    </header>
  );
}

export default Header;
