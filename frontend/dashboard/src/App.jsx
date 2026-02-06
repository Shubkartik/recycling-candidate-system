// App.jsx
import { Container, Title, SimpleGrid, Card, Text, Avatar, Group, Button, Modal, TextInput, Textarea, ActionIcon, Tooltip, Badge } from '@mantine/core';
import { IconTrophy, IconFlame, IconLeaf, IconUsers, IconDownload, IconRobot, IconShare, IconMail, IconCopy, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import candidates from './data/candidates.json';
import Leaderboard from './components/Leaderboard';
import CandidateCard from './components/CandidateCard';
import SkillHeatmap from './components/SkillHeatmap';
import { mockAIEvaluator } from './services/AIEvaluator';
import './App.css';

function App() {
  // Calculate stats for header
  const totalCandidates = candidates.length;
  const avgExperience = (candidates.reduce((sum, c) => sum + c.experience_years, 0) / totalCandidates).toFixed(1);
  const avgScore = (candidates.reduce((sum, c) => sum + (c.crisis_management + c.sustainability + c.team_motivation), 0) / totalCandidates / 3).toFixed(0);

  // AI State
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [sharedCandidates, setSharedCandidates] = useState(new Set());

  // Function to download all candidates as CSV
  const downloadAllCandidatesCSV = () => {
    const csvData = candidates.map(candidate => ({
      ID: candidate.id,
      Name: candidate.name,
      Experience: candidate.experience_years,
      'Crisis Management': candidate.crisis_management,
      Sustainability: candidate.sustainability,
      'Team Motivation': candidate.team_motivation,
      'Total Score': candidate.crisis_management + candidate.sustainability + candidate.team_motivation,
      Skills: candidate.skills.join(', '),
      Status: getStatus(candidate),
      'Shared With HR': sharedCandidates.has(candidate.id) ? 'Yes' : 'No'
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-40-candidates-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Helper function to determine status
  const getStatus = (candidate) => {
    const total = candidate.crisis_management + candidate.sustainability + candidate.team_motivation;
    if (total >= 250) return 'Top';
    if (total >= 200) return 'Good';
    return 'Average';
  };

  // Handle AI Analysis
  const handleAIEvaluateAll = async () => {
    setAiLoading(true);
    try {
      const summary = mockAIEvaluator.getAISummary(candidates);
      setAiSummary(summary);
      
      // Simulate AI processing
      setTimeout(() => {
        setAiLoading(false);
      }, 1500);
    } catch (error) {
      console.error('AI evaluation failed:', error);
      setAiLoading(false);
    }
  };

  // Handle Share Candidate
  const handleShareCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShareModalOpen(true);
    setShareEmail('hr-team@company.com');
    setShareMessage(`Please review candidate ${candidate.name} for the Production Line Manager position.\n\nKey Highlights:\n- ${candidate.experience_years} years experience\n- Skills: ${candidate.skills.join(', ')}\n- Total Score: ${candidate.crisis_management + candidate.sustainability + candidate.team_motivation}/300`);
  };

  // Handle Send Share
  const handleSendShare = () => {
    if (selectedCandidate) {
      setSharedCandidates(prev => new Set([...prev, selectedCandidate.id]));
      console.log(`Candidate ${selectedCandidate.name} shared with ${shareEmail}`);
      alert(`Candidate ${selectedCandidate.name} has been shared with the HR team!`);
      setShareModalOpen(false);
      setShareCopied(false);
    }
  };

  // Handle Copy Share Link
  const handleCopyShareLink = () => {
    if (selectedCandidate) {
      const shareData = {
        candidateId: selectedCandidate.id,
        name: selectedCandidate.name,
        totalScore: selectedCandidate.crisis_management + selectedCandidate.sustainability + selectedCandidate.team_motivation,
        timestamp: new Date().toISOString()
      };
      const shareLink = `${window.location.origin}/candidate/${selectedCandidate.id}?data=${btoa(JSON.stringify(shareData))}`;
      navigator.clipboard.writeText(shareLink);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  // Get shared candidates count
  const sharedCount = sharedCandidates.size;

  return (
    <div className="dashboard-container">
      {/* Header with gradient */}
      <div className="dashboard-header">
        <Container size="xl">
          <Group justify="space-between" align="center">
            <div>
              <Title order={1} className="page-title">
                Recycling Production Line Manager – Candidates
              </Title>
              <Text size="sm" className="page-subtitle">
                Analytics dashboard for HR recruitment and evaluation
              </Text>
            </div>
            <Group>
              <Tooltip label={`${sharedCount} candidates shared with HR`}>
                <Badge 
                  size="lg" 
                  color="blue" 
                  variant="filled"
                  leftSection={<IconShare size={14} />}
                >
                  {sharedCount} Shared
                </Badge>
              </Tooltip>
              <Avatar 
                size="lg" 
                radius="xl" 
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=100"
                alt="HR Analytics"
              />
            </Group>
          </Group>

          {/* Stats Row */}
          <SimpleGrid cols={4} spacing="lg" mt="xl" className="stats-grid">
            <div className="stat-card">
              <Group>
                <div className="stat-icon" style={{ background: '#4299e1' }}>
                  <IconUsers size={24} />
                </div>
                <div>
                  <Text size="xs" c="dimmed">Total Candidates</Text>
                  <Text size="xl" fw={700}>{totalCandidates}</Text>
                </div>
              </Group>
            </div>

            <div className="stat-card">
              <Group>
                <div className="stat-icon" style={{ background: '#38a169' }}>
                  <IconTrophy size={24} />
                </div>
                <div>
                  <Text size="xs" c="dimmed">Avg. Experience</Text>
                  <Text size="xl" fw={700}>{avgExperience} yrs</Text>
                </div>
              </Group>
            </div>

            <div className="stat-card">
              <Group>
                <div className="stat-icon" style={{ background: '#ed8936' }}>
                  <IconFlame size={24} />
                </div>
                <div>
                  <Text size="xs" c="dimmed">Avg. Score</Text>
                  <Text size="xl" fw={700}>{avgScore}/100</Text>
                </div>
              </Group>
            </div>

            <div className="stat-card">
              <Group>
                <div className="stat-icon" style={{ background: '#9f7aea' }}>
                  <IconLeaf size={24} />
                </div>
                <div>
                  <Text size="xs" c="dimmed">Top Performer</Text>
                  <Text size="xl" fw={700}>Sarah Gutkowski</Text>
                </div>
              </Group>
            </div>
          </SimpleGrid>
        </Container>
      </div>

      {/* Main Content */}
      <Container size="xl" className="main-content">
        {/* AI Candidate Analysis Panel */}
        <Card 
          shadow="sm" 
          padding="lg" 
          radius="lg" 
          withBorder
          style={{ marginBottom: '2rem' }}
        >
          <Group justify="space-between" mb="md">
            <div>
              <Title order={3} size="h4">🤖 AI Candidate Analysis (Mock)</Title>
              <Text size="sm" c="dimmed">Powered by your evaluation prompts</Text>
            </div>
            <Group>
              <Button 
                variant="filled" 
                leftSection={<IconShare size={16} />}
                onClick={() => {
                  const topCandidate = [...candidates].sort((a, b) => {
                    const totalA = a.crisis_management + a.sustainability + a.team_motivation;
                    const totalB = b.crisis_management + b.sustainability + b.team_motivation;
                    return totalB - totalA;
                  })[0];
                  handleShareCandidate(topCandidate);
                }}
                color="blue"
              >
                Share Top Candidate
              </Button>
              <Button 
                variant="filled" 
                leftSection={<IconRobot size={16} />}
                onClick={handleAIEvaluateAll}
                loading={aiLoading}
                color="violet"
              >
                Run AI Analysis
              </Button>
            </Group>
          </Group>
          
          {aiSummary && (
            <SimpleGrid cols={3} spacing="md">
              <Card withBorder padding="md">
                <Text size="sm" c="dimmed">AI Average Scores</Text>
                <Text fw={700} size="lg">
                  {aiSummary.average_scores.crisis_management} | 
                  {aiSummary.average_scores.sustainability} | 
                  {aiSummary.average_scores.team_motivation}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>Crisis | Sustain | Team</Text>
              </Card>
              
              <Card withBorder padding="md">
                <Text size="sm" c="dimmed">Top Performer</Text>
                <Text fw={700} size="lg">{aiSummary.top_performer.name}</Text>
                <Text size="xs" c="dimmed" mt={4}>
                  Total: {aiSummary.top_performer.crisis_management + aiSummary.top_performer.sustainability + aiSummary.top_performer.team_motivation}
                </Text>
              </Card>
              
              <Card withBorder padding="md">
                <Text size="sm" c="dimmed">AI Recommendation</Text>
                <Text fw={700} size="sm">{aiSummary.recommendations.hiring_recommendation}</Text>
              </Card>
            </SimpleGrid>
          )}
          
          {!aiSummary && (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              Click "Run AI Analysis" to generate AI-powered insights based on your evaluation prompts
            </Text>
          )}
        </Card>

        {/* Top Section: Leaderboard + Heatmap */}
        <SimpleGrid cols={2} spacing="xl" mb="xl">
          <Card 
            shadow="sm" 
            padding="lg" 
            radius="lg" 
            withBorder
            className="analytics-card"
          >
            <Group justify="space-between" mb="md">
              <Title order={2} size="h3">Top 10 Candidates</Title>
              <Text size="sm" c="dimmed">Sorted by total score</Text>
            </Group>
            <Leaderboard 
              candidates={candidates} 
              onShareCandidate={handleShareCandidate}
              sharedCandidates={sharedCandidates}
            />
          </Card>

          <Card 
            shadow="sm" 
            padding="lg" 
            radius="lg" 
            withBorder
            className="analytics-card"
          >
            <Group justify="space-between" mb="md">
              <Title order={2} size="h3">Skill Score Heatmap</Title>
              <div className="heatmap-legend">
                <div className="legend-item">
                  <span className="color-dot high"></span>
                  <Text size="xs">≥ 80</Text>
                </div>
                <div className="legend-item">
                  <span className="color-dot medium"></span>
                  <Text size="xs">60-79</Text>
                </div>
                <div className="legend-item">
                  <span className="color-dot low"></span>
                  <Text size="xs">&lt; 60</Text>
                </div>
              </div>
            </Group>
            <SkillHeatmap 
              candidates={candidates}
              onShareCandidate={handleShareCandidate}
            />
          </Card>
        </SimpleGrid>

        {/* Bottom Section: All Candidates */}
        <Card 
          shadow="sm" 
          padding="lg" 
          radius="lg" 
          withBorder
          className="candidates-card"
        >
          <Group justify="space-between" mb="md">
            <Group>
              <Title order={2} size="h3">All Candidates ({candidates.length})</Title>
              <Badge color="blue" variant="light" leftSection={<IconShare size={12} />}>
                {sharedCount} Shared
              </Badge>
              <Button 
                variant="filled" 
                size="sm"
                leftSection={<IconDownload size={16} />}
                onClick={downloadAllCandidatesCSV}
                color="blue"
                style={{ marginLeft: '1rem' }}
              >
                Download All CSV
              </Button>
            </Group>
            <Text size="sm" c="dimmed">Click share to forward to HR team</Text>
          </Group>

          <SimpleGrid cols={4} spacing="lg" className="candidates-grid">
            {candidates.map((candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate}
                onShareCandidate={handleShareCandidate}
                isShared={sharedCandidates.has(candidate.id)}
              />
            ))}
          </SimpleGrid>
        </Card>

        {/* Footer */}
        <div className="dashboard-footer">
          <Text size="sm" c="dimmed">
            HR Analytics Dashboard • Data updated in real-time • {new Date().toLocaleDateString()} • {sharedCount} candidates shared
          </Text>
          <Text size="xs" c="dimmed">
            © 2024 Recycling HR System • All candidate data is confidential
          </Text>
        </div>
      </Container>

      {/* Share Modal */}
      <Modal
        opened={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Candidate with HR Team"
        size="md"
        centered
      >
        {selectedCandidate && (
          <>
            <Group mb="md">
              <Avatar 
                size="lg" 
                radius="xl"
                src={`https://i.pravatar.cc/150?img=${selectedCandidate.id}`}
                alt={selectedCandidate.name}
              />
              <div>
                <Text fw={700}>{selectedCandidate.name}</Text>
                <Text size="sm" c="dimmed">
                  Total Score: {selectedCandidate.crisis_management + selectedCandidate.sustainability + selectedCandidate.team_motivation}/300
                </Text>
              </div>
            </Group>

            <TextInput
              label="HR Team Email"
              placeholder="hr-team@company.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              leftSection={<IconMail size={16} />}
              mb="md"
            />

            <Textarea
              label="Message"
              placeholder="Add a note for the HR team..."
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              autosize
              minRows={3}
              mb="md"
            />

            <Group justify="space-between" mb="lg">
              <Text size="sm" c="dimmed">
                Candidate ID: {selectedCandidate.id}
              </Text>
              <Tooltip label={shareCopied ? "Copied!" : "Copy share link"}>
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={handleCopyShareLink}
                >
                  {shareCopied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                </ActionIcon>
              </Tooltip>
            </Group>

            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={() => setShareModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                leftSection={<IconShare size={18} />}
                onClick={handleSendShare}
                color="blue"
              >
                Share Candidate
              </Button>
            </Group>
          </>
        )}
      </Modal>
    </div>
  );
}

export default App;