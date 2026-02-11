import './ResumePreview.css';

/**
 * LaTeX-style ATS Resume Preview
 * Renders exactly like the reference resume template.
 * Only shows sections that have data.
 */
export default function ResumePreview({ data }) {
    const {
        personalInfo = {},
        summary,
        education = [],
        technicalSkills = [],
        internships = [],
        experience = [],
        projects = [],
        skills = [],
        certifications = [],
        codingProfiles = [],
        leadership = [],
    } = data || {};

    const name = personalInfo.fullName || 'Your Name';

    // Build contact line
    const contactParts = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.github,
        personalInfo.linkedin,
        personalInfo.portfolio,
    ].filter(Boolean);

    const hasEducation = education.some((e) => e.institution || e.degree);
    const hasTechnicalSkills = technicalSkills.some((t) => t.category && t.skills);
    const hasInternships = internships.some((i) => i.company || i.role);
    const hasExperience = experience.some((e) => e.company || e.position);
    const hasProjects = projects.some((p) => p.name);
    const hasOldSkills = skills.length > 0 && skills.some((s) => s.name);
    const hasCertifications = certifications.some((c) => c.name);
    const hasCodingProfiles = codingProfiles.some((c) => c.platform);
    const hasLeadership = leadership.some((l) => l.title || l.description);

    const isEmpty = !summary && !hasEducation && !hasTechnicalSkills && !hasInternships &&
        !hasExperience && !hasProjects && !hasOldSkills && !hasCertifications &&
        !hasCodingProfiles && !hasLeadership;

    return (
        <div className="resume-preview">
            <div className="resume-paper">
                {/* ═══ HEADER ═══ */}
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

                {/* ═══ EDUCATION ═══ */}
                {hasEducation && (
                    <Section title="EDUCATION">
                        {education.filter((e) => e.institution || e.degree).map((edu, i) => (
                            <div key={i} className="rp-entry">
                                <div className="rp-entry-header">
                                    <div>
                                        <span className="rp-bold">{edu.institution}</span>
                                        {edu.location && <span>, {edu.location}</span>}
                                    </div>
                                    <div className="rp-date-right">
                                        {edu.endDate ? `Expected Graduation: ${edu.endDate}` : edu.startDate || ''}
                                    </div>
                                </div>
                                <div className="rp-entry-sub">
                                    {edu.degree && <span>{edu.degree}</span>}
                                    {edu.field && <span> ({edu.field})</span>}
                                    {edu.gpa && <span className="rp-float-right">GPA: {edu.gpa}</span>}
                                </div>
                            </div>
                        ))}
                    </Section>
                )}

                {/* ═══ TECHNICAL SKILLS ═══ */}
                {hasTechnicalSkills && (
                    <Section title="TECHNICAL SKILLS">
                        {technicalSkills.filter((t) => t.category && t.skills).map((ts, i) => (
                            <div key={i} className="rp-skill-row">
                                <span className="rp-bold">{ts.category}:</span> {ts.skills}
                            </div>
                        ))}
                    </Section>
                )}

                {/* fallback: old flat skills */}
                {!hasTechnicalSkills && hasOldSkills && (
                    <Section title="TECHNICAL SKILLS">
                        <div className="rp-skill-row">
                            <span className="rp-bold">Skills: </span>
                            {skills.filter((s) => s.name).map((s) => s.name).join(', ')}
                        </div>
                    </Section>
                )}

                {/* ═══ INTERNSHIPS ═══ */}
                {hasInternships && (
                    <Section title="INTERNSHIPS">
                        {internships.filter((i) => i.company || i.role).map((intern, i) => (
                            <div key={i} className="rp-entry">
                                <div className="rp-entry-header">
                                    <div>
                                        <span className="rp-bold">{intern.company}</span>
                                        {intern.location && <span>, {intern.location}</span>}
                                    </div>
                                    <div className="rp-date-right">
                                        {intern.startDate && intern.endDate
                                            ? `${intern.startDate} – ${intern.endDate}`
                                            : intern.startDate || ''}
                                    </div>
                                </div>
                                <div className="rp-entry-sub">
                                    <em>{intern.role}</em>
                                    {intern.link && (
                                        <span className="rp-float-right rp-link">{intern.link.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                    )}
                                </div>
                                {intern.description && (
                                    <BulletList text={intern.description} />
                                )}
                            </div>
                        ))}
                    </Section>
                )}

                {/* ═══ EXPERIENCE ═══ */}
                {hasExperience && (
                    <Section title="EXPERIENCE">
                        {experience.filter((e) => e.company || e.position).map((exp, i) => (
                            <div key={i} className="rp-entry">
                                <div className="rp-entry-header">
                                    <div>
                                        <span className="rp-bold">{exp.company}</span>
                                        {exp.location && <span>, {exp.location}</span>}
                                    </div>
                                    <div className="rp-date-right">
                                        {exp.startDate && (exp.endDate || exp.current)
                                            ? `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`
                                            : exp.startDate || ''}
                                    </div>
                                </div>
                                {exp.position && (
                                    <div className="rp-entry-sub"><em>{exp.position}</em></div>
                                )}
                                {exp.description && (
                                    <BulletList text={exp.description} />
                                )}
                            </div>
                        ))}
                    </Section>
                )}

                {/* ═══ PROJECTS ═══ */}
                {hasProjects && (
                    <Section title="PROJECTS">
                        {projects.filter((p) => p.name).map((proj, i) => (
                            <div key={i} className="rp-entry">
                                <div className="rp-entry-header">
                                    <div>
                                        <span className="rp-bold">{proj.name}</span>
                                        {proj.link && (
                                            <span> | <span className="rp-link">GitHub</span></span>
                                        )}
                                    </div>
                                    <div className="rp-date-right">
                                        {proj.startDate && proj.endDate
                                            ? `${proj.startDate} – ${proj.endDate}`
                                            : proj.startDate
                                                ? `${proj.startDate} – Present`
                                                : ''}
                                    </div>
                                </div>
                                {proj.description && (
                                    <BulletList text={proj.description} />
                                )}
                            </div>
                        ))}
                    </Section>
                )}

                {/* ═══ CERTIFICATIONS ═══ */}
                {hasCertifications && (
                    <Section title="CERTIFICATIONS">
                        {certifications.filter((c) => c.name).map((cert, i) => (
                            <div key={i} className="rp-cert-row">
                                <span>
                                    Certificate on {cert.name}
                                    {cert.issuer && <span> - <span className="rp-bold">{cert.issuer}</span></span>}
                                </span>
                                <span className="rp-date-right">{cert.date || ''}</span>
                            </div>
                        ))}
                    </Section>
                )}

                {/* ═══ CODING PROFILES & PORTFOLIO ═══ */}
                {hasCodingProfiles && (
                    <Section title="CODING PROFILES & PORTFOLIO">
                        {codingProfiles.filter((c) => c.platform).map((cp, i) => (
                            <div key={i} className="rp-skill-row">
                                <span className="rp-bold">{cp.platform}:</span> {cp.stats}
                            </div>
                        ))}
                    </Section>
                )}

                {/* ═══ LEADERSHIP ═══ */}
                {hasLeadership && (
                    <Section title="LEADERSHIP">
                        {leadership.filter((l) => l.title || l.description).map((lead, i) => (
                            <div key={i} className="rp-entry">
                                {lead.title && (
                                    <div className="rp-entry-header">
                                        <span className="rp-bold">{lead.title}</span>
                                    </div>
                                )}
                                {lead.description && <p className="rp-text">{lead.description}</p>}
                            </div>
                        ))}
                    </Section>
                )}

                {/* ═══ SUMMARY (if provided) ═══ */}
                {summary && (
                    <Section title="SUMMARY">
                        <p className="rp-text">{summary}</p>
                    </Section>
                )}

                {/* Empty */}
                {isEmpty && (
                    <div className="rp-empty">
                        <p>Start filling in your details to see a live preview.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Reusable sub-components ─── */

function Section({ title, children }) {
    return (
        <div className="rp-section">
            <h2 className="rp-section-title">{title}</h2>
            <div className="rp-divider"></div>
            {children}
        </div>
    );
}

function BulletList({ text }) {
    const lines = text.split('\n').filter(Boolean);
    return (
        <ul className="rp-bullets">
            {lines.map((line, j) => (
                <li key={j}>{line.replace(/^[-•]\s*/, '')}</li>
            ))}
        </ul>
    );
}
