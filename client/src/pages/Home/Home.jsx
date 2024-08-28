import { NavLink } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import './home.css';

const home = () => {
    return (
        <main className='home-main overlay'>
            <div className='home-container'>
                <div className='home-title'>
                    <h1>Deploy Your Site Easily</h1>
                </div>

                <div className='home-actions'>
                    <NavLink to="/signup">
                        <span>Get Started</span>
                        <FaArrowRight />
                    </NavLink>
                </div>
            </div>
        </main>
    )
}

export default home;
