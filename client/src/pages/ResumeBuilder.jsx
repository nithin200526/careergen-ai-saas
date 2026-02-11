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
        github: '',
    },
    summary: '',
    education: [],
    technicalSkills: [],
    internships: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    codingProfiles: [],
    leadership: [],
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

    // JD Analysis
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            resumeAPI
                .getById(id)
                .then((res) => setForm({ ...emptyResume, ...res.data.resume }))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    /* ─── Generic helpers ─── */
    const updateField = (field, value) => setForm((p) => ({ ...p, [field]: value }));
    const updatePersonalInfo = (field, value) =>
        setForm((p) => ({ ...p, personalInfo: { ...p.personalInfo, [field]: value } }));

    const addArrayItem = (field, item) =>
        setForm((p) => ({ ...p, [field]: [...(p[field] || []), item] }));
    const updateArrayItem = (field, index, key, value) =>
        setForm((p) => ({
            ...p,
            [field]: (p[field] || []).map((el, i) => (i === index ? { ...el, [key]: value } : el)),
        }));
    const removeArrayItem = (field, index) =>
        setForm((p) => ({ ...p, [field]: (p[field] || []).filter((_, i) => i !== index) }));

    /* ─── Skills (flat) ─── */
    const addSkill = () => {
        if (!skillInput.trim()) return;
        addArrayItem('skills', { name: skillInput.trim(), level: 'intermediate' });
        setSkillInput('');
    };

    /* ─── AI Summary ─── */
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

    /* ─── AI JD Analysis ─── */
    const analyzeVsJD = async () => {
        if (!jobDescription.trim()) return setError('Paste a job description first');
        setAnalyzing(true);
        setError('');
        setAnalysis(null);
        try {
            const res = await aiAPI.analyzeResume({ resume: form, jobDescription });
            setAnalysis(res.data.analysis);
        } catch (err) {
            setError(`Analysis Error: ${err.message}`);
        } finally {
            setAnalyzing(false);
        }
    };

    /* ─── Save ─── */
    const handleSave = async () => {
        if (!form.personalInfo.fullName.trim()) return setError('Full name is required');
        if (!form.title.trim()) form.title = `${form.personalInfo.fullName}'s Resume`;
        setSaving(true);
        setError('');
        try {
            if (isEditing) await resumeAPI.update(id, form);
            else await resumeAPI.create(form);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    return (
        <div className="page fade-in">
            <div className="builder-split">
                {/* ═══════════════ LEFT: FORM ═══════════════ */}
                <div className="builder-form-side">
                    <div className="page-header">
                        <h1>{isEditing ? 'Edit Resume' : 'Create New Resume'}</h1>
                        <p>Fill in your details — only <strong>name</strong> is required. Sections with data will appear in the preview.</p>
                    </div>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}
                    {success && <div className="alert alert-success">✅ {success}</div>}

                    {/* ── Resume Title ── */}
                    <FormSection icon="📋" title="Resume Title">
                        <div className="form-group">
                            <input type="text" className="form-input" placeholder="e.g. Full Stack Developer Resume"
                                value={form.title} onChange={(e) => updateField('title', e.target.value)} />
                        </div>
                    </FormSection>

                    {/* ── Personal Info ── */}
                    <FormSection icon="👤" title="Personal Information">
                        <div className="form-row">
                            <FG label="Full Name *">
                                <input type="text" className="form-input" placeholder="Nandala Nithin"
                                    value={form.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                            </FG>
                            <FG label="Email">
                                <input type="email" className="form-input" placeholder="email@example.com"
                                    value={form.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                            </FG>
                        </div>
                        <div className="form-row">
                            <FG label="Phone">
                                <input type="text" className="form-input" placeholder="+91 9392777519"
                                    value={form.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                            </FG>
                            <FG label="Location">
                                <input type="text" className="form-input" placeholder="Hyderabad, India"
                                    value={form.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                            </FG>
                        </div>
                        <div className="form-row">
                            <FG label="GitHub">
                                <input type="url" className="form-input" placeholder="https://github.com/username"
                                    value={form.personalInfo.github} onChange={(e) => updatePersonalInfo('github', e.target.value)} />
                            </FG>
                            <FG label="LinkedIn">
                                <input type="url" className="form-input" placeholder="https://linkedin.com/in/username"
                                    value={form.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
                            </FG>
                        </div>
                        <FG label="Portfolio / Website">
                            <input type="url" className="form-input" placeholder="https://yoursite.com"
                                value={form.personalInfo.portfolio} onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} />
                        </FG>
                    </FormSection>

                    {/* ── Education ── */}
                    <FormSection icon="🎓" title="Education">
                        {(form.education || []).map((edu, i) => (
                            <div key={i} className="entry-card">
                                <button className="remove-btn" onClick={() => removeArrayItem('education', i)}>✕</button>
                                <div className="form-row">
                                    <FG label="Institution">
                                        <input type="text" className="form-input" placeholder="MIT, Stanford, etc."
                                            value={edu.institution} onChange={(e) => updateArrayItem('education', i, 'institution', e.target.value)} />
                                    </FG>
                                    <FG label="Location">
                                        <input type="text" className="form-input" placeholder="Hyderabad, India"
                                            value={edu.location || ''} onChange={(e) => updateArrayItem('education', i, 'location', e.target.value)} />
                                    </FG>
                                </div>
                                <div className="form-row">
                                    <FG label="Degree">
                                        <input type="text" className="form-input" placeholder="B.Tech, M.S., SSC, etc."
                                            value={edu.degree} onChange={(e) => updateArrayItem('education', i, 'degree', e.target.value)} />
                                    </FG>
                                    <FG label="Field of Study">
                                        <input type="text" className="form-input" placeholder="Computer Science"
                                            value={edu.field} onChange={(e) => updateArrayItem('education', i, 'field', e.target.value)} />
                                    </FG>
                                </div>
                                <div className="form-row">
                                    <FG label="Graduation / End Date">
                                        <input type="text" className="form-input" placeholder="August 2027"
                                            value={edu.endDate || ''} onChange={(e) => updateArrayItem('education', i, 'endDate', e.target.value)} />
                                    </FG>
                                    <FG label="GPA / Score">
                                        <input type="text" className="form-input" placeholder="8.51/10 or 10/10"
                                            value={edu.gpa} onChange={(e) => updateArrayItem('education', i, 'gpa', e.target.value)} />
                                    </FG>
                                </div>
                            </div>
                        ))}
                        <button className="add-btn" onClick={() => addArrayItem('education',
                            { institution: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '' })}>
                            + Add Education
                        </button>
                    </FormSection>

                    {/* ── Technical Skills ── */}
                    <FormSection icon="💻" title="Technical Skills">
                        <p className="section-hint">Add categories like <em>Languages</em>, <em>Front-End</em>, <em>Back-End</em>, <em>AI / ML</em>, <em>Tools</em>, etc.</p>
                        {(form.technicalSkills || []).map((ts, i) => (
                            <div key={i} className="entry-card compact-card">
                                <button className="remove-btn" onClick={() => removeArrayItem('technicalSkills', i)}>✕</button>
                                <div className="form-row">
                                    <FG label="Category">
                                        <input type="text" className="form-input" placeholder="Languages"
                                            value={ts.category} onChange={(e) => updateArrayItem('technicalSkills', i, 'category', e.target.value)} />
                                    </FG>
                                    <FG label="Skills (comma-separated)">
                                        <input type="text" className="form-input" placeholder="Python, Java, JavaScript, SQL"
                                            value={ts.skills} onChange={(e) => updateArrayItem('technicalSkills', i, 'skills', e.target.value)} />
                                    </FG>
                                </div>
                            </div>
                        ))}
                        <button className="add-btn" onClick={() => addArrayItem('technicalSkills', { category: '', skills: '' })}>
                            + Add Skill Category
                        </button>
                    </FormSection>

                    {/* ── Internships ── */}
                    <FormSection icon="🏢" title="Internships">
                        {(form.internships || []).map((intern, i) => (
                            <div key={i} className="entry-card">
                                <button className="remove-btn" onClick={() => removeArrayItem('internships', i)}>✕</button>
                                <div className="form-row">
                                    <FG label="Company">
                                        <input type="text" className="form-input" placeholder="Company name"
                                            value={intern.company} onChange={(e) => updateArrayItem('internships', i, 'company', e.target.value)} />
                                    </FG>
                                    <FG label="Role">
                                        <input type="text" className="form-input" placeholder="AI/ML Intern"
                                            value={intern.role} onChange={(e) => updateArrayItem('internships', i, 'role', e.target.value)} />
                                    </FG>
                                </div>
                                <div className="form-row">
                                    <FG label="Location">
                                        <input type="text" className="form-input" placeholder="Hyderabad, India"
                                            value={intern.location || ''} onChange={(e) => updateArrayItem('internships', i, 'location', e.target.value)} />
                                    </FG>
                                    <FG label="Link">
                                        <input type="url" className="form-input" placeholder="https://company.com"
                                            value={intern.link || ''} onChange={(e) => updateArrayItem('internships', i, 'link', e.target.value)} />
                                    </FG>
                                </div>
                                <div className="form-row">
                                    <FG label="Start Date">
                                        <input type="text" className="form-input" placeholder="May 2025"
                                            value={intern.startDate || ''} onChange={(e) => updateArrayItem('internships', i, 'startDate', e.target.value)} />
                                    </FG>
                                    <FG label="End Date">
                                        <input type="text" className="form-input" placeholder="Present"
                                            value={intern.endDate || ''} onChange={(e) => updateArrayItem('internships', i, 'endDate', e.target.value)} />
                                    </FG>
                                </div>
                                <FG label="Description (one bullet per line)">
                                    <textarea className="form-input" rows={3} placeholder="• Worked on real-world datasets&#10;• Developed a classification system&#10;• Gained insights into the project lifecycle"
                                        value={intern.description || ''} onChange={(e) => updateArrayItem('internships', i, 'description', e.target.value)} />
                                </FG>
                            </div>
                        ))}
                        <button className="add-btn" onClick={() => addArrayItem('internships',
                            { company: '', role: '', location: '', startDate: '', endDate: '', link: '', description: '' })}>
                            + Add Internship
                        </button>
                    </FormSection>

                    {/* ── Projects ── */}
                    <FormSection icon="🚀" title="Projects">
                        {(form.projects || []).map((proj, i) => (
                            <div key={i} className="entry-card">
                                <button className="remove-btn" onClick={() => removeArrayItem('projects', i)}>✕</button>
                                <div className="form-row">
                                    <FG label="Project Name">
                                        <input type="text" className="form-input" placeholder="AI-Powered Smart Farming App"
                                            value={proj.name} onChange={(e) => updateArrayItem('projects', i, 'name', e.target.value)} />
                                    </FG>
                                    <FG label="Link (GitHub, etc.)">
                                        <input type="url" className="form-input" placeholder="https://github.com/user/project"
                                            value={proj.link || ''} onChange={(e) => updateArrayItem('projects', i, 'link', e.target.value)} />
                                    </FG>
                                </div>
                                <div className="form-row">
                                    <FG label="Start Date">
                                        <input type="text" className="form-input" placeholder="Jan 2026"
                                            value={proj.startDate || ''} onChange={(e) => updateArrayItem('projects', i, 'startDate', e.target.value)} />
                                    </FG>
                                    <FG label="End Date">
                                        <input type="text" className="form-input" placeholder="Present"
                                            value={proj.endDate || ''} onChange={(e) => updateArrayItem('projects', i, 'endDate', e.target.value)} />
                                    </FG>
                                </div>
                                <FG label="Description (one bullet per line)">
                                    <textarea className="form-input" rows={3} placeholder="• Led a 4-member team to build an Android app&#10;• Integrated ML models using Indian soil data&#10;• Designed for low-connectivity rural usage"
                                        value={proj.description || ''} onChange={(e) => updateArrayItem('projects', i, 'description', e.target.value)} />
                                </FG>
                            </div>
                        ))}
                        <button className="add-btn" onClick={() => addArrayItem('projects',
                            { name: '', link: '', startDate: '', endDate: '', description: '' })}>
                            + Add Project
                        </button>
                    </FormSection>

                    {/* ── Work Experience ── */}
                    <FormSection icon="💼" title="Work Experience">
                        {(form.experience || []).map((exp, i) => (
                            <div key={i} className="entry-card">
                                <button className="remove-btn" onClick={() => removeArrayItem('experience', i)}>✕</button>
                                <div className="form-row">
                                    <FG label="Company">
                                        <input type="text" className="form-input" placeholder="Company name"
                                            value={exp.company} onChange={(e) => updateArrayItem('experience', i, 'company', e.target.value)} />
                                    </FG>
                                    <FG label="Position">
                                        <input type="text" className="form-input" placeholder="Job title"
                                            value={exp.position} onChange={(e) => updateArrayItem('experience', i, 'position', e.target.value)} />
                                    </FG>
                                </div>
                                <div className="form-row">
                                    <FG label="Location">
                                        <input type="text" className="form-input" placeholder="City, Country"
                                            value={exp.location || ''} onChange={(e) => updateArrayItem('experience', i, 'location', e.target.value)} />
                                    </FG>
                                    <div className="form-group" />
                                </div>
                                <div className="form-row">
                                    <FG label="Start Date">
                                        <input type="text" className="form-input" placeholder="Jan 2024"
                                            value={exp.startDate || ''} onChange={(e) => updateArrayItem('experience', i, 'startDate', e.target.value)} />
                                    </FG>
                                    <FG label="End Date">
                                        <input type="text" className="form-input" placeholder="Present"
                                            value={exp.endDate || ''} onChange={(e) => updateArrayItem('experience', i, 'endDate', e.target.value)}
                                            disabled={exp.current} />
                                    </FG>
                                </div>
                                <FG label="Description (one bullet per line)">
                                    <textarea className="form-input" rows={3} placeholder="Key responsibilities and achievements..."
                                        value={exp.description || ''} onChange={(e) => updateArrayItem('experience', i, 'description', e.target.value)} />
                                </FG>
                            </div>
                        ))}
                        <button className="add-btn" onClick={() => addArrayItem('experience',
                            { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' })}>
                            + Add Experience
                        </button>
                    </FormSection>

                    {/* ── Certifications ── */}
                    <FormSection icon="🏆" title="Certifications">
                        {(form.certifications || []).map((cert, i) => (
                            <div key={i} className="entry-card compact-card">
                                <button className="remove-btn" onClick={() => removeArrayItem('certifications', i)}>✕</button>
                                <div className="form-row">
                                    <FG label="Certification Name">
                                        <input type="text" className="form-input" placeholder="Prompt Engineering"
                                            value={cert.name} onChange={(e) => updateArrayItem('certifications', i, 'name', e.target.value)} />
                                    </FG>
                                    <FG label="Issuer">
                                        <input type="text" className="form-input" placeholder="Infosys Springboard"
                                            value={cert.issuer} onChange={(e) => updateArrayItem('certifications', i, 'issuer', e.target.value)} />
                                    </FG>
                                </div>
                                <FG label="Date">
                                    <input type="text" className="form-input" placeholder="Apr 2025"
                                        value={cert.date || ''} onChange={(e) => updateArrayItem('certifications', i, 'date', e.target.value)} />
                                </FG>
                            </div>
                        ))}
                        <button className="add-btn" onClick={() => addArrayItem('certifications',
                            { name: '', issuer: '', date: '', url: '' })}>
                            + Add Certification
                        </button>
                    </FormSection>

                    {/* ── Coding Profiles & Portfolio ── */}
                    <FormSection icon="🖥" title="Coding Profiles & Portfolio">
                        <p className="section-hint">Add your LeetCode, HackerRank, Codeforces stats, etc.</p>
                        {(form.codingProfiles || []).map((cp, i) => (
                            <div key={i} className="entry-card compact-card">
                                <button className="remove-btn" onClick={() => removeArrayItem('codingProfiles', i)}>✕</button>
                                <div className="form-row">
                                    <FG label="Platform">
                                        <input type="text" className="form-input" placeholder="LeetCode"
                                            value={cp.platform} onChange={(e) => updateArrayItem('codingProfiles', i, 'platform', e.target.value)} />
                                    </FG>
                                    <FG label="Stats / Info">
                                        <input type="text" className="form-input" placeholder="355 Problems Solved"
                                            value={cp.stats} onChange={(e) => updateArrayItem('codingProfiles', i, 'stats', e.target.value)} />
                                    </FG>
                                </div>
                            </div>
                        ))}
                        <button className="add-btn" onClick={() => addArrayItem('codingProfiles', { platform: '', stats: '' })}>
                            + Add Profile
                        </button>
                    </FormSection>

                    {/* ── Leadership ── */}
                    <FormSection icon="👑" title="Leadership">
                        {(form.leadership || []).map((lead, i) => (
                            <div key={i} className="entry-card">
                                <button className="remove-btn" onClick={() => removeArrayItem('leadership', i)}>✕</button>
                                <FG label="Title / Role">
                                    <input type="text" className="form-input" placeholder="Team Lead @FARMA Project"
                                        value={lead.title} onChange={(e) => updateArrayItem('leadership', i, 'title', e.target.value)} />
                                </FG>
                                <FG label="Description">
                                    <textarea className="form-input" rows={2} placeholder="Led a cross-functional 4-member team..."
                                        value={lead.description || ''} onChange={(e) => updateArrayItem('leadership', i, 'description', e.target.value)} />
                                </FG>
                            </div>
                        ))}
                        <button className="add-btn" onClick={() => addArrayItem('leadership', { title: '', description: '' })}>
                            + Add Leadership
                        </button>
                    </FormSection>

                    {/* ── AI Summary ── */}
                    <div className="builder-section ai-section">
                        <h3><span className="section-icon">🤖</span> AI Professional Summary</h3>
                        <button className="ai-generate-btn" onClick={generateSummary} disabled={aiLoading}>
                            {aiLoading ? (<><span className="spinner"></span> Generating...</>) : (<>✨ Generate with AI</>)}
                        </button>
                        <FG label="Summary">
                            <textarea className="form-input" rows={4} placeholder="Your professional summary..."
                                value={form.summary || ''} onChange={(e) => updateField('summary', e.target.value)} />
                        </FG>
                    </div>

                    {/* ── JD Analysis ── */}
                    <div className="builder-section jd-section">
                        <h3><span className="section-icon">🎯</span> Job Description Analysis</h3>
                        <p className="section-hint">Paste a job description to see how your resume matches.</p>
                        <FG label="">
                            <textarea className="form-input" rows={5} placeholder="Paste the full job description here..."
                                value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
                        </FG>
                        <button className="ai-generate-btn" onClick={analyzeVsJD} disabled={analyzing}>
                            {analyzing ? (<><span className="spinner"></span> Analyzing...</>) : (<>🎯 Analyze Match</>)}
                        </button>

                        {analysis && (
                            <div className="analysis-results fade-in">
                                <div className="match-score-bar">
                                    <div className="match-score-label">
                                        <span>ATS Match Score</span>
                                        <span className={`match-score-value ${analysis.matchScore >= 80 ? 'score-high' : analysis.matchScore >= 50 ? 'score-mid' : 'score-low'
                                            }`}>{analysis.matchScore}%</span>
                                    </div>
                                    <div className="match-bar-track">
                                        <div className={`match-bar-fill ${analysis.matchScore >= 80 ? 'bar-high' : analysis.matchScore >= 50 ? 'bar-mid' : 'bar-low'
                                            }`} style={{ width: `${analysis.matchScore}%` }}></div>
                                    </div>
                                </div>
                                {analysis.strengths?.length > 0 && (
                                    <div className="analysis-block">
                                        <h4>✅ Strengths</h4>
                                        <ul>{analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                                    </div>
                                )}
                                {analysis.missingSkills?.length > 0 && (
                                    <div className="analysis-block missing">
                                        <h4>⚠️ Missing Skills</h4>
                                        <div className="missing-tags">
                                            {analysis.missingSkills.map((s, i) => <span key={i} className="missing-tag">{s}</span>)}
                                        </div>
                                    </div>
                                )}
                                {analysis.missingSections?.length > 0 && (
                                    <div className="analysis-block missing">
                                        <h4>📝 Missing Sections</h4>
                                        <div className="missing-tags">
                                            {analysis.missingSections.map((s, i) => <span key={i} className="missing-tag section-tag">{s}</span>)}
                                        </div>
                                    </div>
                                )}
                                {analysis.suggestions?.length > 0 && (
                                    <div className="analysis-block">
                                        <h4>💡 Suggestions</h4>
                                        <ul>{analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Actions ── */}
                    <div className="builder-actions">
                        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? <span className="spinner"></span> : isEditing ? 'Update Resume' : 'Save Resume'}
                        </button>
                    </div>
                </div>

                {/* ═══════════════ RIGHT: LIVE PREVIEW ═══════════════ */}
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

/* ─── Reusable sub-components ─── */

function FormSection({ icon, title, children }) {
    return (
        <div className="builder-section">
            <h3><span className="section-icon">{icon}</span> {title}</h3>
            {children}
        </div>
    );
}

function FG({ label, children }) {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            {children}
        </div>
    );
}
