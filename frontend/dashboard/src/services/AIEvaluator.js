// services/AIEvaluator.js

// Mock AI Evaluation Service
export const mockAIEvaluator = {
  
  // Evaluate a single candidate using mock AI
  evaluateCandidate: (candidate) => {
    console.log(`🤖 AI evaluating candidate: ${candidate.name}`);
    
    // Simulate AI thinking/processing delay
    const thinkingTime = Math.random() * 1000 + 500;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const scores = {
          crisis_management: generateCrisisManagementScore(candidate),
          sustainability: generateSustainabilityScore(candidate),
          team_motivation: generateTeamMotivationScore(candidate),
          ai_comments: generateAIComments(candidate)
        };
        resolve(scores);
      }, thinkingTime);
    });
  },
  
  // Evaluate all candidates
  evaluateAllCandidates: async (candidates) => {
    console.log(`🤖 AI evaluating all ${candidates.length} candidates...`);
    const evaluations = [];
    
    for (const candidate of candidates) {
      const evaluation = await mockAIEvaluator.evaluateCandidate(candidate);
      evaluations.push({
        candidateId: candidate.id,
        candidateName: candidate.name,
        ...evaluation
      });
    }
    
    return evaluations;
  },
  
  // Get AI evaluation summary
  getAISummary: (candidates) => {
    const total = candidates.length;
    const avgCrisis = candidates.reduce((sum, c) => sum + c.crisis_management, 0) / total;
    const avgSustain = candidates.reduce((sum, c) => sum + c.sustainability, 0) / total;
    const avgTeam = candidates.reduce((sum, c) => sum + c.team_motivation, 0) / total;
    
    return {
      total_candidates: total,
      average_scores: {
        crisis_management: avgCrisis.toFixed(1),
        sustainability: avgSustain.toFixed(1),
        team_motivation: avgTeam.toFixed(1)
      },
      top_performer: candidates.reduce((best, current) => 
        (current.crisis_management + current.sustainability + current.team_motivation) > 
        (best.crisis_management + best.sustainability + best.team_motivation) ? current : best
      ),
      recommendations: generateRecommendations(candidates)
    };
  }
};

// Helper functions for generating mock scores based on your prompts
function generateCrisisManagementScore(candidate) {
  let baseScore = 50;
  
  // Factors from your crisis management prompt
  if (candidate.skills.includes('Safety')) baseScore += 25;
  if (candidate.skills.includes('Leadership')) baseScore += 15;
  if (candidate.experience_years > 5) baseScore += 10;
  if (candidate.experience_years > 10) baseScore += 5;
  
  // Add some randomness
  baseScore += Math.random() * 10;
  
  return Math.min(100, Math.round(baseScore));
}

function generateSustainabilityScore(candidate) {
  let baseScore = 50;
  
  // Factors from your sustainability prompt
  if (candidate.skills.includes('Sustainability')) baseScore += 30;
  if (candidate.skills.includes('Recycling')) baseScore += 20;
  if (candidate.skills.includes('Operations')) baseScore += 10;
  
  // Experience bonus
  if (candidate.experience_years > 3) baseScore += 5;
  
  // Add some randomness
  baseScore += Math.random() * 10;
  
  return Math.min(100, Math.round(baseScore));
}

function generateTeamMotivationScore(candidate) {
  let baseScore = 50;
  
  // Factors from your team motivation prompt
  if (candidate.skills.includes('Leadership')) baseScore += 30;
  if (candidate.skills.includes('Operations')) baseScore += 15;
  if (candidate.skills.includes('Safety')) baseScore += 10;
  
  // Experience bonus
  if (candidate.experience_years > 2) baseScore += 5;
  if (candidate.experience_years > 5) baseScore += 5;
  
  // Add some randomness
  baseScore += Math.random() * 10;
  
  return Math.min(100, Math.round(baseScore));
}

function generateAIComments(candidate) {
  const total = candidate.crisis_management + candidate.sustainability + candidate.team_motivation;
  const avg = total / 3;
  
  const comments = [];
  
  // Crisis management comments
  if (candidate.crisis_management >= 80) {
    comments.push("✅ Excellent crisis response capability");
  } else if (candidate.crisis_management >= 60) {
    comments.push("⚠️ Adequate crisis management skills");
  } else {
    comments.push("❌ Needs improvement in emergency handling");
  }
  
  // Sustainability comments
  if (candidate.sustainability >= 80) {
    comments.push("✅ Strong sustainability knowledge");
  } else if (candidate.sustainability >= 60) {
    comments.push("⚠️ Moderate environmental awareness");
  } else {
    comments.push("❌ Limited recycling regulations knowledge");
  }
  
  // Team motivation comments
  if (candidate.team_motivation >= 80) {
    comments.push("✅ Proven leadership and team-building skills");
  } else if (candidate.team_motivation >= 60) {
    comments.push("⚠️ Average team management ability");
  } else {
    comments.push("❌ Needs development in conflict resolution");
  }
  
  // Overall assessment
  if (avg >= 80) {
    comments.push("🏆 AI Recommendation: STRONGLY RECOMMEND");
  } else if (avg >= 65) {
    comments.push("👍 AI Recommendation: RECOMMEND WITH TRAINING");
  } else {
    comments.push("⚠️ AI Recommendation: REVIEW FURTHER");
  }
  
  return comments;
}

function generateRecommendations(candidates) {
  const top3 = [...candidates]
    .sort((a, b) => {
      const totalA = a.crisis_management + a.sustainability + a.team_motivation;
      const totalB = b.crisis_management + b.sustainability + b.team_motivation;
      return totalB - totalA;
    })
    .slice(0, 3);
  
  return {
    top_candidates: top3.map(c => ({
      name: c.name,
      total_score: c.crisis_management + c.sustainability + c.team_motivation,
      strengths: getStrengths(c)
    })),
    skill_gaps: analyzeSkillGaps(candidates),
    hiring_recommendation: "Based on AI analysis, prioritize candidates with balanced scores across all three domains."
  };
}

function getStrengths(candidate) {
  const strengths = [];
  if (candidate.crisis_management >= 80) strengths.push("Crisis Management");
  if (candidate.sustainability >= 80) strengths.push("Sustainability");
  if (candidate.team_motivation >= 80) strengths.push("Team Leadership");
  return strengths.length > 0 ? strengths : ["Well-rounded performer"];
}

function analyzeSkillGaps(candidates) {
  const avgCrisis = candidates.reduce((sum, c) => sum + c.crisis_management, 0) / candidates.length;
  const avgSustain = candidates.reduce((sum, c) => sum + c.sustainability, 0) / candidates.length;
  const avgTeam = candidates.reduce((sum, c) => sum + c.team_motivation, 0) / candidates.length;
  
  const gaps = [];
  if (avgCrisis < 70) gaps.push("Crisis Management");
  if (avgSustain < 70) gaps.push("Sustainability Knowledge");
  if (avgTeam < 70) gaps.push("Team Motivation");
  
  return gaps.length > 0 ? gaps : ["No significant skill gaps detected"];
}