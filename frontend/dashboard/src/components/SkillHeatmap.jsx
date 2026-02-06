// components/SkillHeatmap.jsx
import { Table, TextInput, Button, Group, ActionIcon, Tooltip, ScrollArea } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconMinus, IconSearch, IconSortAscending, IconSortDescending, IconArrowsSort, IconShare } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import './SkillHeatmap.css';

function SkillHeatmap({ candidates, onShareCandidate }) {
  const [sortField, setSortField] = useState('total');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const top10 = useMemo(() => {
    let filtered = [...candidates]
      .map(c => ({ 
        ...c, 
        total: c.crisis_management + c.sustainability + c.team_motivation 
      }));

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortField === 'crisis') {
        aValue = a.crisis_management;
        bValue = b.crisis_management;
      } else if (sortField === 'sustainability') {
        aValue = a.sustainability;
        bValue = b.sustainability;
      } else if (sortField === 'motivation') {
        aValue = a.team_motivation;
        bValue = b.team_motivation;
      } else if (sortField === 'total') {
        aValue = a.total;
        bValue = b.total;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered.slice(0, 10);
  }, [candidates, sortField, sortDirection, searchQuery]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <IconArrowsSort size={14} />;
    return sortDirection === 'asc' ? 
      <IconSortAscending size={14} /> : 
      <IconSortDescending size={14} />;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: '#c6f6d5', color: '#22543d', label: 'Excellent' };
    if (score >= 60) return { bg: '#fefcbf', color: '#744210', label: 'Good' };
    return { bg: '#fed7d7', color: '#742a2a', label: 'Needs Work' };
  };

  const getTrendIcon = (score, avg) => {
    if (score > avg + 10) return <IconArrowUp size={16} color="#38a169" />;
    if (score < avg - 10) return <IconArrowDown size={16} color="#e53e3e" />;
    return <IconMinus size={16} color="#a0aec0" />;
  };

  // Calculate averages
  const crisisAvg = top10.reduce((sum, c) => sum + c.crisis_management, 0) / top10.length;
  const sustainAvg = top10.reduce((sum, c) => sum + c.sustainability, 0) / top10.length;
  const teamAvg = top10.reduce((sum, c) => sum + c.team_motivation, 0) / top10.length;

  return (
    <div className="heatmap-wrapper">
      {/* Search and Controls */}
      <Group justify="space-between" mb="md">
        <TextInput
          placeholder="Search candidates..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
          style={{ width: '250px' }}
        />
        <Group>
          <Button 
            variant="subtle" 
            size="compact-sm"
            rightSection={getSortIcon('total')}
            onClick={() => handleSort('total')}
          >
            Sort by Total Score
          </Button>
        </Group>
      </Group>

      {/* Scrollable container for the heatmap table */}
      <ScrollArea 
        type="auto" 
        offsetScrollbars 
        styles={{
          root: {
            overflowX: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          },
          scrollbar: {
            '&[data-orientation="horizontal"]': {
              height: '10px',
            },
          }
        }}
      >
        <div style={{ minWidth: '850px' }}>
          <Table className="heatmap-table" verticalSpacing="md">
            <thead>
              <tr>
                <th style={{ textAlign: 'center', width: '180px' }}>
                  <Button 
                    variant="subtle" 
                    size="compact-sm"
                    rightSection={getSortIcon('name')}
                    onClick={() => handleSort('name')}
                    style={{ 
                      padding: 0, 
                      height: 'auto',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                  >
                    Candidate
                  </Button>
                </th>
                <th style={{ textAlign: 'center', width: '180px' }}>
                  <div className="skill-header" style={{ alignItems: 'center' }}>
                    <Button 
                      variant="subtle" 
                      size="compact-sm"
                      rightSection={getSortIcon('crisis')}
                      onClick={() => handleSort('crisis')}
                      style={{ 
                        padding: 0, 
                        height: 'auto',
                        justifyContent: 'center',
                        width: '100%',
                        marginBottom: '4px'
                      }}
                    >
                      Crisis Management
                    </Button>
                    <div className="skill-average" style={{ justifyContent: 'center' }}>
                      <span className="average-label">Avg:</span>
                      <span className="average-value">{crisisAvg.toFixed(0)}</span>
                    </div>
                  </div>
                </th>
                <th style={{ textAlign: 'center', width: '180px' }}>
                  <div className="skill-header" style={{ alignItems: 'center' }}>
                    <Button 
                      variant="subtle" 
                      size="compact-sm"
                      rightSection={getSortIcon('sustainability')}
                      onClick={() => handleSort('sustainability')}
                      style={{ 
                        padding: 0, 
                        height: 'auto',
                        justifyContent: 'center',
                        width: '100%',
                        marginBottom: '4px'
                      }}
                    >
                      Sustainability
                    </Button>
                    <div className="skill-average" style={{ justifyContent: 'center' }}>
                      <span className="average-label">Avg:</span>
                      <span className="average-value">{sustainAvg.toFixed(0)}</span>
                    </div>
                  </div>
                </th>
                <th style={{ textAlign: 'center', width: '180px' }}>
                  <div className="skill-header" style={{ alignItems: 'center' }}>
                    <Button 
                      variant="subtle" 
                      size="compact-sm"
                      rightSection={getSortIcon('motivation')}
                      onClick={() => handleSort('motivation')}
                      style={{ 
                        padding: 0, 
                        height: 'auto',
                        justifyContent: 'center',
                        width: '100%',
                        marginBottom: '4px'
                      }}
                    >
                      Team Motivation
                    </Button>
                    <div className="skill-average" style={{ justifyContent: 'center' }}>
                      <span className="average-label">Avg:</span>
                      <span className="average-value">{teamAvg.toFixed(0)}</span>
                    </div>
                  </div>
                </th>
                <th style={{ textAlign: 'center', width: '80px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {top10.map((c) => {
                const crisisStyle = getScoreColor(c.crisis_management);
                const sustainStyle = getScoreColor(c.sustainability);
                const teamStyle = getScoreColor(c.team_motivation);

                return (
                  <tr key={c.id}>
                    <td style={{ textAlign: 'center' }}>
                      <div className="heatmap-candidate" style={{ alignItems: 'center' }}>
                        <div className="candidate-name">{c.name}</div>
                        <div className="candidate-rank">
                          Rank #{top10.findIndex(x => x.id === c.id) + 1}
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div 
                        className="score-cell" 
                        style={{ 
                          backgroundColor: crisisStyle.bg, 
                          color: crisisStyle.color,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div className="score-main" style={{ justifyContent: 'center' }}>
                          <span className="score-value">{c.crisis_management}</span>
                          {getTrendIcon(c.crisis_management, crisisAvg)}
                        </div>
                        <div className="score-label">{crisisStyle.label}</div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div 
                        className="score-cell" 
                        style={{ 
                          backgroundColor: sustainStyle.bg, 
                          color: sustainStyle.color,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div className="score-main" style={{ justifyContent: 'center' }}>
                          <span className="score-value">{c.sustainability}</span>
                          {getTrendIcon(c.sustainability, sustainAvg)}
                        </div>
                        <div className="score-label">{sustainStyle.label}</div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div 
                        className="score-cell" 
                        style={{ 
                          backgroundColor: teamStyle.bg, 
                          color: teamStyle.color,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div className="score-main" style={{ justifyContent: 'center' }}>
                          <span className="score-value">{c.team_motivation}</span>
                          {getTrendIcon(c.team_motivation, teamAvg)}
                        </div>
                        <div className="score-label">{teamStyle.label}</div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Tooltip label="Share with HR team">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => onShareCandidate && onShareCandidate(c)}
                          size="sm"
                        >
                          <IconShare size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}

export default SkillHeatmap;