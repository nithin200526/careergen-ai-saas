import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI, aiAPI } from '../services/api';
import ResumePreview from '../components/ResumePreview';

const emptyResume = {
    title: '',
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
};

export default function ResumeBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id && id !== 'new';

    const [form, setForm] = useState(emptyResume);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [skillInput, setSkillInput] = useState('');

    // ── JD Analysis state ──
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            resumeAPI
                .getById(id)
                .then((res) => setForm(res.data.resume))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const updatePersonalInfo = (field, value) => {
        setForm((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value },
        }));
    };

    // ── Experience ──
    const addExperience = () => {
        setForm((prev) => ({
            ...prev,
            experience: [
                ...prev.experience,
                { company: '', position: '', startDate: '', endDate: '', current: false, description: '' },
            ],
        }));
    };

    const updateExperience = (index, field, value) => {
        setForm((prev) => ({
            ...prev,
            experience: prev.experience.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            ),
        }));
    };

    const removeExperience = (index) => {
        setForm((prev) => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index),
        }));
    };

    // ── Education ──
    const addEducation = () => {
        setForm((prev) => ({
            ...prev,
            education: [
                ...prev.education,
                { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
            ],
        }));
    };

    const updateEducation = (index, field, value) => {
        setForm((prev) => ({
            ...prev,
            education: prev.education.map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            ),
        }));
    };

    const removeEducation = (index) => {
        setForm((prev) => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index),
        }));
    };

    // ── Skills ──
    const addSkill = () => {
        if (!skillInput.trim()) return;
        setForm((prev) => ({
            ...prev,
            skills: [...prev.skills, { name: skillInput.trim(), level: 'intermediate' }],
        }));
        setSkillInput('');
    };

    const removeSkill = (index) => {
        setForm((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    // ── Certifications ──
    const addCertification = () => {
        setForm((prev) => ({
            ...prev,
            certifications: [
                ...(prev.certifications || []),
                { name: '', issuer: '', date: '' },
            ],
        }));
    };

    const updateCertification = (index, field, value) => {
        setForm((prev) => ({
            ...prev,
            certifications: (prev.certifications || []).map((c, i) =>
                i === index ? { ...c, [field]: value } : c
            ),
        }));
    };

    const removeCertification = (index) => {
        setForm((prev) => ({
            ...prev,
            certifications: (prev.certifications || []).filter((_, i) => i !== index),
        }));
    };

    // ── AI Summary ──
    const generateSummary = async () => {
        setAiLoading(true);
        setError('');
        try {
            const res = await aiAPI.generateSummary({
                jobTitle: form.title || 'Professional',
                experience: form.experience,
                skills: form.skills,
                tone: 'professional',
            });
            updateField('summary', res.data.summary);
            setSuccess('AI summary generated!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(`AI Error: ${err.message}`);
        } finally {
            setAiLoading(false);
        }
    };

    // ── AI JD Analysis ──
    const analyzeVsJD = async () => {
        if (!jobDescription.trim()) {
            setError('Please paste a job description first');
            return;
        }
        setAnalyzing(true);
        setError('');
        setAnalysis(null);
        try {
            const res = await aiAPI.analyzeResume({
                resume: form,
                jobDescription,
            });
            setAnalysis(res.data.analysis);
        } catch (err) {
            setError(`Analysis Error: ${err.message}`);
        } finally {
            setAnalyzing(false);
        }
    };

    // ── Save ──
    const handleSave = async () => {
        if (!form.personalInfo.fullName.trim()) {
            setError('Full name is required');
            return;
        }
        if (!form.title.trim()) {
            // Auto-set title from name if empty
            form.title = `${form.personalInfo.fullName}'s Resume`;
        }

        setSaving(true);
        setError('');
        try {
            if (isEditing) {
                await resumeAPI.update(id, form);
            } else {
                await resumeAPI.create(form);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
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
            <div className="builder-split">
                {/* ── LEFT: Form ── */}
                <div className="builder-form-side">
                    <div className="page-header">
                        <h1>{isEditing ? 'Edit Resume' : 'Create New Resume'}</h1>
                        <p>Fill in your details. Only your <strong>name</strong> is required — everything else is optional.</p>
                    </div>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}
                    {success && <div className="alert alert-success">✅ {success}</div>}

                    {/* Title */}
                    <div className="builder-section">
                        <h3><span className="section-icon">📋</span> Resume Title</h3>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Full Stack Developer Resume"
                                value={form.title}
                                onChange={(e) => updateField('title', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="builder-section">
                        <h3><span className="section-icon">👤</span> Personal Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name <span style={{ color: 'var(--accent-primary)' }}>*</span></label>
                                <input type="text" className="form-input" placeholder="Your Name"
                                    value={form.personalInfo.fullName}
                                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-input" placeholder="email@example.com"
                                    value={form.personalInfo.email}
                                    onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" className="form-input" placeholder="+1 234 567 890"
                                    value={form.personalInfo.phone}
                                    onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" className="form-input" placeholder="City, Country"
                                    value={form.personalInfo.location}
                                    onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>LinkedIn</label>
                                <input type="url" className="form-input" placeholder="https://linkedin.com/in/..."
                                    value={form.personalInfo.linkedin}
                                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Portfolio</label>
                                <input type="url" className="form-input" placeholder="https://yoursite.com"
                                    value={form.personalInfo.portfolio}
                                    onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* AI Summary */}
                    <div className="builder-section ai-section">
                        <h3><span className="section-icon">🤖</span> Professional Summary</h3>
                        <button className="ai-generate-btn" onClick={generateSummary} disabled={aiLoading}>
                            {aiLoading ? (<><span className="spinner"></span> Generating...</>) : (<>✨ Generate with AI</>)}
                        </button>
                        <div className="form-group">
                            <textarea className="form-input" rows={4} placeholder="Your professional summary..."
                                value={form.summary} onChange={(e) => updateField('summary', e.target.value)} />
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="builder-section">
                        <h3><span className="section-icon">💼</span> Work Experience</h3>
                        {form.experience.map((exp, i) => (
                            <div key={i} className="entry-card">
                                <button className="remove-btn" onClick={() => removeExperience(i)}>✕</button>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Company</label>
                                        <input type="text" className="form-input" placeholder="Company name"
                                            value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Position</label>
                                        <input type="text" className="form-input" placeholder="Job title"
                                            value={exp.position} onChange={(e) => updateExperience(i, 'position', e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input type="date" className="form-input"
                                            value={exp.startDate ? exp.startDate.split('T')[0] : ''}
                                            onChange={(e) => updateExperience(i, 'startDate', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input type="date" className="form-input"
                                            value={exp.endDate ? exp.endDate.split('T')[0] : ''}
                                            onChange={(e) => updateExperience(i, 'endDate', e.target.value)}
                                            disabled={exp.current} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description <span style={{ color: 'var(--text-muted)', fontSize: '0.8em' }}>(one bullet per line)</span></label>
                                    <textarea className="form-input" rows={3} placeholder="Key responsibilities and achievements..."
                                        value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <button className="add-btn" onClick={addExperience}>+ Add Experience</button>
                    </div>

                    {/* Education */}
                    <div className="builder-section">
                        <h3><span className="section-icon">🎓</span> Education</h3>
                        {form.education.map((edu, i) => (
                            <div key={i} className="entry-card">
                                <button className="remove-btn" onClick={() => removeEducation(i)}>✕</button>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Institution</label>
                                        <input type="text" className="form-input" placeholder="University name"
                                            value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Degree</label>
                                        <input type="text" className="form-input" placeholder="B.S., M.S., etc."
                                            value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Field of Study</label>
                                        <input type="text" className="form-input" placeholder="Computer Science"
                                            value={edu.field} onChange={(e) => updateEducation(i, 'field', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>GPA</label>
                                        <input type="text" className="form-input" placeholder="3.8/4.0"
                                            value={edu.gpa} onChange={(e) => updateEducation(i, 'gpa', e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input type="date" className="form-input"
                                            value={edu.startDate ? edu.startDate.split('T')[0] : ''}
                                            onChange={(e) => updateEducation(i, 'startDate', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input type="date" className="form-input"
                                            value={edu.endDate ? edu.endDate.split('T')[0] : ''}
                                            onChange={(e) => updateEducation(i, 'endDate', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="add-btn" onClick={addEducation}>+ Add Education</button>
                    </div>

                    {/* Skills */}
                    <div className="builder-section">
                        <h3><span className="section-icon">🛠</span> Skills</h3>
                        <div className="skills-grid">
                            {form.skills.map((skill, i) => (
                                <div key={i} className="skill-tag">
                                    {skill.name}
                                    <span className="remove-skill" onClick={() => removeSkill(i)}>✕</span>
                                </div>
                            ))}
                        </div>
                        <div className="skill-input-row">
                            <input type="text" className="form-input" placeholder="Add a skill (e.g. React)"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                            <button className="btn btn-secondary btn-sm" onClick={addSkill}>Add</button>
                        </div>
                    </div>

                    {/* Certifications */}
                    <div className="builder-section">
                        <h3><span className="section-icon">🏆</span> Certifications</h3>
                        {(form.certifications || []).map((cert, i) => (
                            <div key={i} className="entry-card">
                                <button className="remove-btn" onClick={() => removeCertification(i)}>✕</button>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Certification Name</label>
                                        <input type="text" className="form-input" placeholder="AWS Solutions Architect"
                                            value={cert.name} onChange={(e) => updateCertification(i, 'name', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Issuer</label>
                                        <input type="text" className="form-input" placeholder="Amazon"
                                            value={cert.issuer} onChange={(e) => updateCertification(i, 'issuer', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="add-btn" onClick={addCertification}>+ Add Certification</button>
                    </div>

                    {/* ── Job Description Analysis ── */}
                    <div className="builder-section jd-section">
                        <h3><span className="section-icon">🎯</span> Job Description Analysis</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: '0.9rem' }}>
                            Paste a job description to see how well your resume matches and what's missing.
                        </p>
                        <div className="form-group">
                            <textarea
                                className="form-input"
                                rows={6}
                                placeholder="Paste the full job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                        <button className="ai-generate-btn" onClick={analyzeVsJD} disabled={analyzing}>
                            {analyzing ? (<><span className="spinner"></span> Analyzing...</>) : (<>🎯 Analyze Match</>)}
                        </button>

                        {/* Analysis Results */}
                        {analysis && (
                            <div className="analysis-results fade-in">
                                {/* Match Score */}
                                <div className="match-score-bar">
                                    <div className="match-score-label">
                                        <span>ATS Match Score</span>
                                        <span className={`match-score-value ${analysis.matchScore >= 80 ? 'score-high' :
                                                analysis.matchScore >= 50 ? 'score-mid' : 'score-low'
                                            }`}>
                                            {analysis.matchScore}%
                                        </span>
                                    </div>
                                    <div className="match-bar-track">
                                        <div
                                            className={`match-bar-fill ${analysis.matchScore >= 80 ? 'bar-high' :
                                                    analysis.matchScore >= 50 ? 'bar-mid' : 'bar-low'
                                                }`}
                                            style={{ width: `${analysis.matchScore}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Strengths */}
                                {analysis.strengths?.length > 0 && (
                                    <div className="analysis-block">
                                        <h4>✅ Strengths</h4>
                                        <ul>
                                            {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Missing Skills */}
                                {analysis.missingSkills?.length > 0 && (
                                    <div className="analysis-block missing">
                                        <h4>⚠️ Missing Skills</h4>
                                        <div className="missing-tags">
                                            {analysis.missingSkills.map((s, i) => (
                                                <span key={i} className="missing-tag">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Missing Sections */}
                                {analysis.missingSections?.length > 0 && (
                                    <div className="analysis-block missing">
                                        <h4>📝 Missing Sections</h4>
                                        <div className="missing-tags">
                                            {analysis.missingSections.map((s, i) => (
                                                <span key={i} className="missing-tag section-tag">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Suggestions */}
                                {analysis.suggestions?.length > 0 && (
                                    <div className="analysis-block">
                                        <h4>💡 Suggestions</h4>
                                        <ul>
                                            {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="builder-actions">
                        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? <span className="spinner"></span> : isEditing ? 'Update Resume' : 'Save Resume'}
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: Live Preview ── */}
                <div className="builder-preview-side">
                    <div className="preview-header">
                        <h3>📄 Live Preview</h3>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ATS-friendly format</span>
                    </div>
                    <ResumePreview data={form} />
                </div>
            </div>
        </div>
    );
}
