// components/CandidateCard.jsx
import { Card, Avatar, Badge, Group, Text, Button, Progress, Collapse, Tooltip } from '@mantine/core';
import { IconShare, IconBriefcase, IconStar, IconRobot, IconChevronDown, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { mockAIEvaluator } from '../services/AIEvaluator';
import './CandidateCard.css';

const CandidateCard = ({ candidate, onShareCandidate, isShared }) => {
  const totalScore = candidate.crisis_management + candidate.sustainability + candidate.team_motivation;
  const avgScore = totalScore / 3;
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiExpanded, setAiExpanded] = useState(false);

  const skillColors = {
    'Recycling': '#38a169',
    'Safety': '#e53e3e',
    'Leadership': '#3182ce',
    'Sustainability': '#38b2ac',
    'Operations': '#805ad5'
  };

  const handleShare = () => {
    if (onShareCandidate) {
      onShareCandidate(candidate);
    } else {
      // Fallback share functionality
      const shareData = {
        name: candidate.name,
        score: totalScore,
        link: `/candidates/${candidate.id}`
      };
      console.log('Sharing candidate:', shareData);
      alert(`Candidate ${candidate.name} has been shared with the HR team!`);
    }
  };

  const handleAIEvaluate = async () => {
    setLoading(true);
    try {
      const evaluation = await mockAIEvaluator.evaluateCandidate(candidate);
      setAiEvaluation(evaluation);
      setAiExpanded(true);
    } catch (error) {
      console.error('AI evaluation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="lg" 
      withBorder 
      className="candidate-card"
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        border: isShared ? '2px solid #4299e1' : '1px solid #e2e8f0'
      }}
    >
      {/* Header with avatar and average score */}
      <Card.Section className="card-header" p="md">
        <Group justify="space-between" align="flex-start">
          <Group>
            <Avatar 
              size="lg" 
              radius="xl"
              src={`https://i.pravatar.cc/150?img=${candidate.id}`}
              alt={candidate.name}
            />
            <div>
              <Group gap="xs">
                <Text fw={700} size="lg">{candidate.name}</Text>
                {isShared && (
                  <Tooltip label="Shared with HR team">
                    <Badge color="green" size="xs" variant="dot">
                      Shared
                    </Badge>
                  </Tooltip>
                )}
              </Group>
              <Group gap="xs">
                <IconBriefcase size={16} />
                <Text size="sm" c="dimmed">{candidate.experience_years} years experience</Text>
              </Group>
            </div>
          </Group>
          <Badge 
            color={
              avgScore >= 80 ? 'green' :
              avgScore >= 60 ? 'yellow' : 'red'
            }
            size="lg"
          >
            {avgScore.toFixed(0)}/100
          </Badge>
        </Group>
      </Card.Section>

      {/* Skills Tags - Fixed height */}
      <div className="skills-section" style={{ minHeight: '72px' }}>
        <Text fw={600} size="sm" mb="xs">Skills</Text>
        <Group gap="xs" className="skill-tags">
          {candidate.skills.map((skill, idx) => (
            <Badge 
              key={idx}
              color={skillColors[skill] || 'gray'}
              variant="light"
              size="sm"
              radius="sm"
            >
              {skill}
            </Badge>
          ))}
        </Group>
      </div>

      {/* Performance Scores - Fixed height */}
      <div className="scores-section" style={{ minHeight: '180px' }}>
        <Text fw={600} size="sm" mb="xs">Performance Scores</Text>
        
        <div className="score-item">
          <Group justify="space-between" mb={4}>
            <Text size="sm">Crisis Management</Text>
            <Text fw={700} size="sm">{candidate.crisis_management}</Text>
          </Group>
          <Progress 
            value={candidate.crisis_management} 
            color={candidate.crisis_management >= 80 ? 'green' : candidate.crisis_management >= 60 ? 'yellow' : 'red'}
            size="lg"
            radius="xl"
          />
        </div>

        <div className="score-item">
          <Group justify="space-between" mb={4}>
            <Text size="sm">Sustainability</Text>
            <Text fw={700} size="sm">{candidate.sustainability}</Text>
          </Group>
          <Progress 
            value={candidate.sustainability} 
            color={candidate.sustainability >= 80 ? 'green' : candidate.sustainability >= 60 ? 'yellow' : 'red'}
            size="lg"
            radius="xl"
          />
        </div>

        <div className="score-item">
          <Group justify="space-between" mb={4}>
            <Text size="sm">Team Motivation</Text>
            <Text fw={700} size="sm">{candidate.team_motivation}</Text>
          </Group>
          <Progress 
            value={candidate.team_motivation} 
            color={candidate.team_motivation >= 80 ? 'green' : candidate.team_motivation >= 60 ? 'yellow' : 'red'}
            size="lg"
            radius="xl"
          />
        </div>
      </div>

      {/* AI Evaluation Section - ALWAYS VISIBLE but collapsible */}
      <Card.Section 
        p="md" 
        style={{ 
          backgroundColor: aiEvaluation ? '#f8fafc' : '#f8f9fa',
          borderTop: '1px solid #e2e8f0',
          minHeight: aiEvaluation ? (aiExpanded ? '150px' : '64px') : '64px',
          transition: 'min-height 0.3s ease'
        }}
      >
        <Group justify="space-between" mb={aiEvaluation && aiExpanded ? 'xs' : 0}>
          <Group gap="xs">
            <IconRobot size={18} color={aiEvaluation ? "#4299e1" : "#a0aec0"} />
            <Text fw={600} size="sm" c={aiEvaluation ? "dark" : "dimmed"}>
              {aiEvaluation ? 'AI Evaluation' : 'AI Evaluation Available'}
            </Text>
          </Group>
          
          {aiEvaluation ? (
            <Button 
              variant="subtle" 
              size="xs"
              onClick={() => setAiExpanded(!aiExpanded)}
              rightSection={<IconChevronDown size={14} style={{ 
                transform: aiExpanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s'
              }} />}
            >
              {aiExpanded ? 'Hide' : 'Show'}
            </Button>
          ) : (
            <Button 
              variant="light" 
              size="xs"
              leftSection={<IconRobot size={14} />}
              onClick={handleAIEvaluate}
              loading={loading}
              color="blue"
            >
              Evaluate
            </Button>
          )}
        </Group>
        
        {aiEvaluation && (
          <Collapse in={aiExpanded}>
            <div style={{ marginTop: '0.5rem' }}>
              {aiEvaluation.ai_comments.map((comment, idx) => (
                <Text key={idx} size="xs" mb={4}>
                  {comment}
                </Text>
              ))}
            </div>
          </Collapse>
        )}
        
        <Group justify="space-between" mt={aiEvaluation && aiExpanded ? 'md' : 0}>
          {aiEvaluation ? (
            <>
              <Badge color="blue" variant="light">
                🤖 AI Verified
              </Badge>
              <Text size="xs" c="dimmed">
                Powered by Mock AI
              </Text>
            </>
          ) : (
            <Text size="xs" c="dimmed" style={{ width: '100%', textAlign: 'center' }}>
              Click "Evaluate" to get AI analysis
            </Text>
          )}
        </Group>
      </Card.Section>

      {/* Total Score - Fixed position */}
      <Card.Section className="total-score-section" p="md">
        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">Total Score</Text>
            <Text fw={800} size="xl">{totalScore}<Text span size="sm" c="dimmed">/300</Text></Text>
          </div>
          <div className="star-rating">
            <IconStar size={20} fill="#fbbf24" color="#fbbf24" />
            <Text fw={600} size="sm">
              {avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : 'Average'}
            </Text>
          </div>
        </Group>
      </Card.Section>

      {/* Action Buttons - Fixed at bottom */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <Group gap="xs">
          <Button 
            size="md" 
            radius="lg"
            leftSection={<IconRobot size={20} />}
            variant={aiEvaluation ? "filled" : "light"}
            color="violet"
            onClick={handleAIEvaluate}
            loading={loading}
            style={{ flex: 1 }}
          >
            {aiEvaluation ? 'Re-evaluate' : 'AI Evaluate'}
          </Button>
          
          <Button 
            size="md" 
            radius="lg"
            leftSection={isShared ? <IconCheck size={20} /> : <IconShare size={20} />}
            variant={isShared ? "filled" : "gradient"}
            gradient={!isShared ? { from: '#4299e1', to: '#3182ce' } : undefined}
            color={isShared ? "green" : "blue"}
            onClick={handleShare}
            style={{ flex: 1 }}
          >
            {isShared ? 'Shared' : 'Share'}
          </Button>
        </Group>
      </div>
    </Card>
  );
};

export default CandidateCard;