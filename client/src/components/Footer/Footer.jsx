import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import navLinks from "../../utils/NavigationLinks";
import "./footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="line" />

            <div className="social-links">
                <FaGithub className="social-icon" />
                <FaLinkedin className="social-icon" />
                <FaSquareXTwitter className="social-icon" />
            </div>

            <div className="site-links">
                <ul>
                    {navLinks.map(({ title, path }) => (
                        <li key={title}>
                            <NavLink to={`/${path}`}>{title}</NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
