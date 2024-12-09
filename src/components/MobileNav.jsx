import { TbMap, TbUser, TbQrcode } from "react-icons/tb";
import { NavLink } from "react-router-dom";

export default function MobileNav() {
  return (
    <nav className="nav">
      <NavLink to="/" end>
        <TbMap className="icon" />
        <p>Karta</p>
      </NavLink>
      <div></div>
      <NavLink to="/" end className="qricon">
        <TbQrcode className="icon" />
      </NavLink>
      <NavLink to="/profile" end>
        <TbUser className="icon" />
        <p>Profil</p>
      </NavLink>
    </nav>
  );
}
