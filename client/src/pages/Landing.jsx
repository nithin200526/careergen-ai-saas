import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
    const { user } = useAuth();

    return (
        <div className="landing">
            {/* ════════════ HERO SECTION ════════════ */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">✨ V2.0 Now Available</div>
                        <h1>
                            Craft Your Career<br />
                            <span className="text-gradient-accent">With Liquid Precision</span>
                        </h1>
                        <p>
                            ResumeForge AI isn't just a builder. It's an intelligent career architect.
                            Create ATS-optimized, design-perfect resumes in minutes with our
                            ultra-premium AI engine.
                        </p>

                        <div className="hero-buttons">
                            {user ? (
                                <Link to="/dashboard" className="btn btn-lg btn-primary">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn btn-lg btn-primary">
                                        Start Building Free
                                    </Link>
                                    <Link to="/login" className="btn btn-lg btn-secondary">
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="hero-stats">
                            <div className="hero-stat">
                                <div className="number">10k+</div>
                                <div className="label">Resumes Built</div>
                            </div>
                            <div className="hero-stat">
                                <div className="number">98%</div>
                                <div className="label">ATS Success</div>
                            </div>
                            <div className="hero-stat">
                                <div className="number">4.9/5</div>
                                <div className="label">User Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════ EXPERIENCE SECTION ════════════ */}
            <section className="experience-section">
                <div className="container">
                    <div className="section-header">
                        <h2>The Premium Experience</h2>
                        <p>Designed for professionals who demand excellence.</p>
                    </div>

                    <div className="experience-grid">
                        {/* Card 1 */}
                        <div className="glass-feature-card">
                            <div className="glass-icon">⚡</div>
                            <h3>Instant AI Analysis</h3>
                            <p>
                                Upload your existing resume or start from scratch. Our neural engine
                                analyzes your profile against millions of job descriptions to
                                find your competitive edge.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="glass-feature-card">
                            <div className="glass-icon">💎</div>
                            <h3>Liquid Glass Design</h3>
                            <p>
                                Stand out with our signature aesthetic. Clean, modern, and
                                professional templates that look stunning on screens and
                                print perfectly on paper.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="glass-feature-card">
                            <div className="glass-icon">🎯</div>
                            <h3>ATS Precision</h3>
                            <p>
                                Don't get filtered out. Our algorithms ensure your resume is
                                formatted exactly how Fortune 500 tracking systems
                                like to read them.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════ AI INTELLIGENCE ════════════ */}
            <section className="ai-section-landing">
                <div className="container">
                    <div className="ai-split">
                        <div className="ai-content">
                            <h2>Intelligence Depth.<br />Surface Simplicity.</h2>
                            <p>
                                Beneath the beautiful glass interface lies a powerful LLM tailored
                                specifically for career data. It doesn't just check for spelling;
                                it restructures your bullet points for maximum impact.
                            </p>
                            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', lineHeight: '2' }}>
                                <li>✨ Context-aware keyword optimization</li>
                                <li>✨ Role-specific summary generation</li>
                                <li>✨ Real-time match score analysis</li>
                                <li>✨ Missing skill detection</li>
                            </ul>
                        </div>

                        <div className="ai-visual">
                            <div className="ai-card-stack">
                                <div className="ai-card c1"></div>
                                <div className="ai-card c2"></div>
                                <div className="ai-card c3">
                                    <div style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }}>
                                        <div style={{ height: '8px', width: '40%', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                                        <div style={{ height: '6px', width: '90%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                                        <div style={{ height: '6px', width: '95%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                                    </div>
                                    <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(99,102,241,0.1)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)' }}>
                                        <div style={{ color: '#818cf8', fontSize: '0.9rem', fontWeight: '600' }}>AI Match Score: 98%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════ PRICING ════════════ */}
            <section className="pricing-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Simple, Transparent Pricing</h2>
                        <p>Start for free, upgrade for power.</p>
                    </div>

                    <div className="pricing-grid">
                        {/* Free */}
                        <div className="pricing-card">
                            <h3>Starter</h3>
                            <div className="price">$0<span>/mo</span></div>
                            <ul className="pricing-features">
                                <li><span className="check">✓</span> 1 Resume</li>
                                <li><span className="check">✓</span> Basic AI Analysis</li>
                                <li><span className="check">✓</span> Standard Template</li>
                                <li><span className="check">✓</span> PDF Download</li>
                            </ul>
                            <Link to="/register" className="btn btn-secondary" style={{ width: '100%' }}>
                                Get Started
                            </Link>
                        </div>

                        {/* Pro */}
                        <div className="pricing-card pro">
                            <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '0.8rem', color: '#818cf8', background: 'rgba(99,102,241,0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(99,102,241,0.3)' }}>
                                POPULAR
                            </div>
                            <h3>Pro Architect</h3>
                            <div className="price">$12<span>/mo</span></div>
                            <ul className="pricing-features">
                                <li><span className="check">✓</span> Unlimited Resumes</li>
                                <li><span className="check">✓</span> Advanced AI Writer</li>
                                <li><span className="check">✓</span> All Premium Templates</li>
                                <li><span className="check">✓</span> Cover Letter Generator</li>
                                <li><span className="check">✓</span> LinkedIn Optimization</li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%' }}>
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════ FOOTER ════════════ */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <div className="footer-logo">
                            <span className="text-gradient">CareerGen AI</span>
                        </div>
                        <div className="footer-copy">
                            © 2026 CareerGen AI. All rights reserved.
                        </div>
                    </div>
                    <div className="footer-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Contact</a>
                        <a href="#">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
