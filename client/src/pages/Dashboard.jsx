import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';

export default function Dashboard() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const res = await resumeAPI.getAll();
            setResumes(res.data.resumes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resume?')) return;

        try {
            await resumeAPI.delete(id);
            setResumes((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page fade-in">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="page-header" style={{ marginBottom: 0 }}>
                            <span style={{
                                background: 'var(--accent-gradient)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontSize: '1.8rem',
                                fontWeight: 700,
                            }}>
                                My Resumes
                            </span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} created
                        </p>
                    </div>
                    <Link to="/resume/new" className="btn btn-primary">
                        + Create Resume
                    </Link>
                </div>

                {error && <div className="alert alert-error">⚠️ {error}</div>}

                {resumes.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📄</div>
                        <h3>No resumes yet</h3>
                        <p>Create your first AI-powered resume and stand out!</p>
                        <Link to="/resume/new" className="btn btn-primary">
                            + Create Your First Resume
                        </Link>
                    </div>
                ) : (
                    <div className="resumes-grid">
                        {resumes.map((resume) => (
                            <div key={resume._id} className="resume-card">
                                <div className="resume-card-header">
                                    <div>
                                        <h3>{resume.title}</h3>
                                        <div className="resume-date">
                                            Updated {new Date(resume.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                {resume.summary && (
                                    <div className="resume-summary">{resume.summary}</div>
                                )}
                                <div className="resume-card-actions">
                                    <Link
                                        to={`/resume/${resume._id}`}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(resume._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
