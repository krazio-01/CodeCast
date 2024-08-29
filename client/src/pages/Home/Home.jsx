import { NavLink } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import LogsImg from "../../assets/feature1.png";
import FastDeploymentImg from "../../assets/feature2.jpg";
import "./home.css";

const home = () => {
    return (
        <main className="home-main">
            <div className="home-container overlay">
                <div className="home-title">
                    <h1>Deploy Your Site Easily</h1>
                    <p>
                        Experience seamless deployment with instant logs and lightning-fast updates.
                    </p>
                </div>

                <div className="home-actions">
                    <NavLink to="/signup">
                        <span>Get Started</span>
                        <FaArrowRight />
                    </NavLink>
                </div>
            </div>

            <div className="home-content">

                <h2>Key Features</h2>

                <div className="features">
                    <div className="feature">
                        <img src={LogsImg} alt="Logs" />
                        <div>
                            <h3>Logs</h3>
                            <span>Monitor real-time logs for complete visibility.</span>
                        </div>
                    </div>

                    <div className="line" />

                    <div className="feature">
                        <div>
                            <h3>Fast Deployment</h3>
                            <span>Deploy updates in seconds with our optimized pipeline.</span>
                        </div>
                        <img src={FastDeploymentImg} alt="Fast Deployment" />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default home;
