import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
    const { user } = useAuth();

    return (
        <div className="landing">
            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">🚀 AI-Powered Resume Builder</div>
                    <h1>
                        Build Your Dream Resume
                        <br />
                        <span className="gradient-text">With AI Precision</span>
                    </h1>
                    <p>
                        Create stunning, ATS-optimized resumes in minutes. Our AI generates
                        professional summaries tailored to your experience and target role.
                    </p>
                    <div className="hero-buttons">
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Start Building Free →
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="number">10K+</div>
                            <div className="label">Resumes Created</div>
                        </div>
                        <div className="hero-stat">
                            <div className="number">95%</div>
                            <div className="label">ATS Pass Rate</div>
                        </div>
                        <div className="hero-stat">
                            <div className="number">50+</div>
                            <div className="label">Templates</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div className="container">
                    <div className="section-header">
                        <h2>Everything You Need</h2>
                        <p>Professional resume building, powered by artificial intelligence</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h3>AI-Generated Summaries</h3>
                            <p>
                                Our AI analyzes your experience and skills to craft compelling
                                professional summaries that catch recruiters' attention.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>ATS-Optimized</h3>
                            <p>
                                Every resume is optimized to pass Applicant Tracking Systems,
                                ensuring your application reaches human eyes.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Build in Minutes</h3>
                            <p>
                                Our intuitive builder guides you step-by-step. Fill in your
                                details, and we handle the formatting.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure & Private</h3>
                            <p>
                                Your data is encrypted and stored securely. We never share your
                                personal information with third parties.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Responsive Design</h3>
                            <p>
                                Build and manage your resumes from any device — desktop, tablet,
                                or mobile. Your data syncs everywhere.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>Multiple Resumes</h3>
                            <p>
                                Create different versions tailored for different roles. Keep all
                                your resumes organized in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
