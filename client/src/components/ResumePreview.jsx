import './ResumePreview.css';

/**
 * LaTeX-style ATS Resume Preview
 * Only renders sections that have data. Name is the only required field.
 */
export default function ResumePreview({ data }) {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [], certifications = [] } = data || {};
    const name = personalInfo.fullName || data?.title || 'Your Name';

    // Contact line
    const contactParts = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.linkedin,
        personalInfo.portfolio,
        personalInfo.location,
    ].filter(Boolean);

    const hasExperience = experience.some((e) => e.company || e.position);
    const hasEducation = education.some((e) => e.institution || e.degree);
    const hasSkills = skills.length > 0 && skills.some((s) => s.name);
    const hasCertifications = certifications && certifications.length > 0 && certifications.some((c) => c.name);

    return (
        <div className="resume-preview">
            <div className="resume-paper">
                {/* Header */}
                <div className="rp-header">
                    <h1 className="rp-name">{name}</h1>
                    {contactParts.length > 0 && (
                        <div className="rp-contact">
                            {contactParts.map((part, i) => (
                                <span key={i}>
                                    {i > 0 && <span className="rp-separator"> | </span>}
                                    {part.startsWith('http') ? (
                                        <span className="rp-link">{part.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                    ) : (
                                        part
                                    )}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary */}
                {summary && (
                    <div className="rp-section">
                        <h2 className="rp-section-title">SUMMARY</h2>
                        <div className="rp-divider"></div>
                        <p className="rp-text">{summary}</p>
                    </div>
                )}

                {/* Education */}
                {hasEducation && (
                    <div className="rp-section">
                        <h2 className="rp-section-title">EDUCATION</h2>
                        <div className="rp-divider"></div>
                        {education.filter((e) => e.institution || e.degree).map((edu, i) => (
                            <div key={i} className="rp-entry">
                                <div className="rp-entry-header">
                                    <div>
                                        <span className="rp-bold">{edu.institution}</span>
                                        {edu.location && <span>, {edu.location}</span>}
                                    </div>
                                    <div className="rp-date">
                                        {formatDate(edu.startDate)} {edu.endDate ? `– ${formatDate(edu.endDate)}` : edu.startDate ? '– Present' : ''}
                                    </div>
                                </div>
                                <div className="rp-entry-sub">
                                    {edu.degree && <span>{edu.degree}</span>}
                                    {edu.field && <span> in {edu.field}</span>}
                                    {edu.gpa && <span className="rp-float-right">GPA: {edu.gpa}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills */}
                {hasSkills && (
                    <div className="rp-section">
                        <h2 className="rp-section-title">TECHNICAL SKILLS</h2>
                        <div className="rp-divider"></div>
                        <div className="rp-skills">
                            <span className="rp-bold">Skills: </span>
                            {skills.filter((s) => s.name).map((s) => s.name).join(', ')}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {hasExperience && (
                    <div className="rp-section">
                        <h2 className="rp-section-title">EXPERIENCE</h2>
                        <div className="rp-divider"></div>
                        {experience.filter((e) => e.company || e.position).map((exp, i) => (
                            <div key={i} className="rp-entry">
                                <div className="rp-entry-header">
                                    <div>
                                        <span className="rp-bold">{exp.company}</span>
                                        {exp.position && <span> — <em>{exp.position}</em></span>}
                                    </div>
                                    <div className="rp-date">
                                        {formatDate(exp.startDate)} {exp.endDate ? `– ${formatDate(exp.endDate)}` : exp.current ? '– Present' : ''}
                                    </div>
                                </div>
                                {exp.description && (
                                    <ul className="rp-bullets">
                                        {exp.description.split('\n').filter(Boolean).map((line, j) => (
                                            <li key={j}>{line.replace(/^[-•]\s*/, '')}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Certifications */}
                {hasCertifications && (
                    <div className="rp-section">
                        <h2 className="rp-section-title">CERTIFICATIONS</h2>
                        <div className="rp-divider"></div>
                        {certifications.filter((c) => c.name).map((cert, i) => (
                            <div key={i} className="rp-entry-inline">
                                <span className="rp-bold">{cert.name}</span>
                                {cert.issuer && <span> — {cert.issuer}</span>}
                                {cert.date && <span className="rp-date rp-float-right">{formatDate(cert.date)}</span>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!summary && !hasExperience && !hasEducation && !hasSkills && (
                    <div className="rp-empty">
                        <p>Start filling in your details on the left to see a live preview here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
