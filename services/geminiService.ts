import { GoogleGenAI, Type } from "@google/genai";
import { SkillGapReport, ProfileAnalysisResult, User } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Skill Gap Analysis ---
export const analyzeSkillGap = async (
  currentSkills: string[],
  targetRole: string
): Promise<SkillGapReport> => {
  if (!apiKey) {
    return {
      targetRole: targetRole,
      missingSkills: ['Advanced System Design', 'Kubernetes', 'GraphQL'],
      recommendations: ['Take the "Advanced Cloud Patterns" course', 'Build a microservices project'],
      learningSprintPlan: 'Week 1: Containerization basics. Week 2: Orchestration with K8s. Week 3: Service Mesh. Week 4: Capstone.'
    };
  }

  const model = 'gemini-2.5-flash';
  const prompt = `
    You are a career counselor.
    Skills: ${currentSkills.join(', ')}.
    Target: ${targetRole}.
    Analyze the gap. Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            learningSprintPlan: { type: Type.STRING }
          },
          required: ["missingSkills", "recommendations", "learningSprintPlan"]
        }
      }
    });

    const result = JSON.parse(response.text!);
    return {
      targetRole,
      missingSkills: result.missingSkills || [],
      recommendations: result.recommendations || [],
      learningSprintPlan: result.learningSprintPlan || "Focus on project-based learning."
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// --- Profile Verification (Fake Profile Detection) ---
export const verifyUserProfile = async (userProfile: User): Promise<ProfileAnalysisResult> => {
    if (!apiKey) {
        // Mock response
        return {
            isSuspicious: Math.random() > 0.7,
            confidenceScore: 88,
            reasons: ['Email domain matches institution records', 'Skills correlate with Department']
        };
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
        Analyze this user profile for potential authenticity issues or fake data.
        Profile Data: ${JSON.stringify(userProfile)}
        
        Check for:
        1. Mismatched skills for the department.
        2. Suspicious email patterns (valid RUAS or company emails are good).
        3. Generic or inconsistent data.
        
        Return JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isSuspicious: { type: Type.BOOLEAN },
                        confidenceScore: { type: Type.NUMBER },
                        reasons: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });

        return JSON.parse(response.text!) as ProfileAnalysisResult;
    } catch (error) {
        console.error("Verification Error", error);
        throw error;
    }
};