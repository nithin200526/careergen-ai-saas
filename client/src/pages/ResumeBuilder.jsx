import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI, aiAPI } from '../services/api';

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

    // ── Save ──
    const handleSave = async () => {
        if (!form.title.trim()) {
            setError('Resume title is required');
            return;
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
            <div className="container">
                <div className="page-header">
                    <h1>{isEditing ? 'Edit Resume' : 'Create New Resume'}</h1>
                    <p>Fill in your details below. Use AI to generate your professional summary.</p>
                </div>

                {error && <div className="alert alert-error">⚠️ {error}</div>}
                {success && <div className="alert alert-success">✅ {success}</div>}

                <div className="builder-layout">
                    {/* Title */}
                    <div className="builder-section">
                        <h3><span className="section-icon">📋</span> Resume Title</h3>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Software Engineer Resume"
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
                                <label>Full Name</label>
                                <input type="text" className="form-input" placeholder="John Doe"
                                    value={form.personalInfo.fullName}
                                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-input" placeholder="john@example.com"
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
                                <input type="text" className="form-input" placeholder="San Francisco, CA"
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
                        <button
                            className="ai-generate-btn"
                            onClick={generateSummary}
                            disabled={aiLoading}
                        >
                            {aiLoading ? (
                                <>
                                    <span className="spinner"></span> Generating with AI...
                                </>
                            ) : (
                                <>✨ Generate with AI</>
                            )}
                        </button>
                        <div className="form-group">
                            <textarea
                                className="form-input"
                                rows={5}
                                placeholder="Your professional summary will appear here..."
                                value={form.summary}
                                onChange={(e) => updateField('summary', e.target.value)}
                            />
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
                                    <label>Description</label>
                                    <textarea className="form-input" rows={3} placeholder="Key responsibilities..."
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
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Add a skill (e.g. React, Node.js)"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            />
                            <button className="btn btn-secondary btn-sm" onClick={addSkill}>Add</button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="builder-actions">
                        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? <span className="spinner"></span> : isEditing ? 'Update Resume' : 'Save Resume'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
