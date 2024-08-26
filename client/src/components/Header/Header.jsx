import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";
import "./header.css";

const navLinks = [
    {
        title: "Product",
        path: "product",
    },
    {
        title: "Pricing",
        path: "pricing",
    },
    {
        title: "Contact",
        path: "contact",
    },
];

const Header = () => {
    return (
        <header>
            <div className="header-container">
                <div className="header-starter">
                    <NavLink to="/" className="logo">
                        <img src={Logo} alt="logo" />
                        <span>CodeCast</span>
                    </NavLink>

                    <nav className="header-nav">
                        <ul>
                            {navLinks.map(({ title, path }) => (
                                <li key={title}>
                                    <NavLink to={`/${path}`}>{title}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="header-end">
                    <div className="auth-links">
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/signup">Sign Up</NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
