const ApiError = require('../utils/ApiError');

/**
 * AI Service
 * Abstraction layer for AI provider integration.
 * Supports OpenAI-compatible APIs (Ollama, OpenAI, etc.)
 */
class AIService {
    constructor() {
        this.apiUrl = process.env.AI_API_URL || 'http://localhost:11434/v1/chat/completions';
        this.model = process.env.AI_MODEL || 'llama3';
    }

    /**
     * Internal helper — call the chat completions API
     * @private
     */
    async _chatCompletion(systemPrompt, userPrompt, maxTokens = 500, temperature = 0.7) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt },
                    ],
                    max_tokens: maxTokens,
                    temperature,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `AI API error: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content?.trim();
            if (!content) throw new Error('No response from AI');
            return content;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            console.error('AI Service Error:', error.message);
            throw ApiError.internal(`AI generation failed: ${error.message}`);
        }
    }

    /**
     * Generate a professional summary for a resume
     */
    async generateSummary({ jobTitle, experience, skills, tone = 'professional' }) {
        const prompt = this._buildSummaryPrompt({ jobTitle, experience, skills, tone });
        const systemPrompt =
            'You are an expert resume writer. Generate concise, impactful professional summaries tailored for the given role. Keep it between 3-5 sentences. Return ONLY the summary text, no extra labels.';
        return this._chatCompletion(systemPrompt, prompt, 300, 0.7);
    }

    /**
     * Analyze resume against a job description
     * Returns: { matchScore, missingSkills, suggestions, strengths }
     */
    async analyzeResumeVsJD({ resume, jobDescription }) {
        const resumeText = this._resumeToText(resume);

        const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach.
Analyze the resume against the job description. Respond in VALID JSON only, with this exact structure:
{
  "matchScore": <number 0-100>,
  "strengths": ["strength 1", "strength 2", ...],
  "missingSkills": ["skill 1", "skill 2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "missingSections": ["section name 1", ...]
}
Rules:
- matchScore: How well the resume matches the JD (0-100)
- strengths: What the resume already does well for this role
- missingSkills: Skills mentioned in the JD but not in the resume
- suggestions: Actionable advice to improve the resume for this role
- missingSections: Resume sections that are empty but would help (e.g. "Certifications", "Projects")
Return ONLY valid JSON. No markdown, no backticks, no explanation.`;

        const userPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`;

        const raw = await this._chatCompletion(systemPrompt, userPrompt, 800, 0.4);

        // Parse JSON from the response (strip markdown fences if present)
        try {
            const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleaned);
        } catch (e) {
            console.error('Failed to parse AI analysis JSON:', raw);
            // Return a fallback
            return {
                matchScore: 0,
                strengths: [],
                missingSkills: [],
                suggestions: ['AI returned an unparseable response. Please try again.'],
                missingSections: [],
            };
        }
    }

    /**
     * Convert resume data to plain text for AI analysis
     * @private
     */
    _resumeToText(resume) {
        let text = `Title: ${resume.title || 'N/A'}\n`;
        const pi = resume.personalInfo || {};
        if (pi.fullName) text += `Name: ${pi.fullName}\n`;
        if (pi.email) text += `Email: ${pi.email}\n`;

        if (resume.summary) text += `\nSummary: ${resume.summary}\n`;

        if (resume.experience?.length) {
            text += `\nExperience:\n`;
            resume.experience.forEach((e) => {
                text += `- ${e.position || ''} at ${e.company || ''}\n`;
                if (e.description) text += `  ${e.description}\n`;
            });
        }

        if (resume.education?.length) {
            text += `\nEducation:\n`;
            resume.education.forEach((e) => {
                text += `- ${e.degree || ''} in ${e.field || ''} from ${e.institution || ''}\n`;
            });
        }

        if (resume.skills?.length) {
            text += `\nSkills: ${resume.skills.map((s) => s.name || s).join(', ')}\n`;
        }

        if (resume.certifications?.length) {
            text += `\nCertifications: ${resume.certifications.map((c) => c.name).join(', ')}\n`;
        }

        return text;
    }

    /**
     * Build the prompt for summary generation
     * @private
     */
    _buildSummaryPrompt({ jobTitle, experience, skills, tone }) {
        let prompt = `Generate a ${tone} resume summary for a ${jobTitle}`;

        if (experience && experience.length > 0) {
            const expSummary = experience
                .map((exp) => `${exp.position} at ${exp.company}`)
                .join(', ');
            prompt += ` with experience as: ${expSummary}`;
        }

        if (skills && skills.length > 0) {
            const skillNames = skills.map((s) => (typeof s === 'string' ? s : s.name)).join(', ');
            prompt += `. Key skills: ${skillNames}`;
        }

        prompt += '. Make it compelling and ATS-friendly.';
        return prompt;
    }
}

module.exports = new AIService();
