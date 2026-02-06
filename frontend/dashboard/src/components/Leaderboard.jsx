// components/Leaderboard.jsx
import { Table, Badge, Avatar, TextInput, Group, Button, ActionIcon, Tooltip, Box, ScrollArea } from '@mantine/core';
import { 
  IconCrown, 
  IconMedal, 
  IconAward, 
  IconSearch, 
  IconSortAscending, 
  IconSortDescending, 
  IconArrowsSort,
  IconDownload,
  IconShare
} from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import './Leaderboard.css';

function Leaderboard({ candidates, onShareCandidate, sharedCandidates }) {
  const [sortField, setSortField] = useState('total');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const top10 = useMemo(() => {
    let filtered = [...candidates]
      .map(c => ({ 
        ...c, 
        total: c.crisis_management + c.sustainability + c.team_motivation 
      }));

    // Apply search filter for both candidate name and skills
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(candidate => {
        // Search in name
        const nameMatch = candidate.name.toLowerCase().includes(query);
        
        // Search in skills
        const skillMatch = candidate.skills.some(skill => 
          skill.toLowerCase().includes(query)
        );
        
        // Return true if either name OR skills match
        return nameMatch || skillMatch;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortField === 'experience') {
        aValue = a.experience_years;
        bValue = b.experience_years;
      } else if (sortField === 'total') {
        aValue = a.total;
        bValue = b.total;
      } else if (sortField === 'crisis') {
        aValue = a.crisis_management;
        bValue = b.crisis_management;
      } else if (sortField === 'sustainability') {
        aValue = a.sustainability;
        bValue = b.sustainability;
      } else if (sortField === 'motivation') {
        aValue = a.team_motivation;
        bValue = b.team_motivation;
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

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <IconCrown size={20} color="#fbbf24" />;
      case 2: return <IconMedal size={20} color="#94a3b8" />;
      case 3: return <IconAward size={20} color="#d97706" />;
      default: return rank;
    }
  };

  const downloadCSV = () => {
    const csvData = top10.map(candidate => ({
      Rank: top10.findIndex(x => x.id === candidate.id) + 1,
      Name: candidate.name,
      Experience: candidate.experience_years,
      'Crisis Management': candidate.crisis_management,
      Sustainability: candidate.sustainability,
      'Team Motivation': candidate.team_motivation,
      'Total Score': candidate.total,
      Skills: candidate.skills.join(', '),
      Status: candidate.total >= 250 ? 'Top' : candidate.total >= 200 ? 'Good' : 'Average',
      'Shared With HR': sharedCandidates && sharedCandidates.has(candidate.id) ? 'Yes' : 'No'
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => 
      Object.values(row).map(value => 
        `"${value}"`
      ).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `top-10-candidates-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Count shared candidates in top 10
  const sharedCountInTop10 = sharedCandidates ? 
    Array.from(sharedCandidates).filter(id => 
      top10.some(c => c.id === id)
    ).length : 0;

  return (
    <div className="leaderboard-wrapper">
      {/* Single line header with search on left and buttons on right */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        gap: '1rem',
        flexWrap: 'nowrap'
      }}>
        {/* Search Bar on Left */}
        <Box style={{ flex: 1 }}>
          <TextInput
            placeholder="Search by candidate name or skills..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            style={{ width: '100%', maxWidth: '400px' }}
          />
        </Box>

        {/* Shared Badge and Download Button on Right */}
        <Group gap="sm" style={{ flexShrink: 0 }}>
          {sharedCandidates && (
            <Badge 
              color="blue" 
              variant="light" 
              leftSection={<IconShare size={12} />}
              size="sm"
              style={{ height: '32px', display: 'flex', alignItems: 'center' }}
            >
              {sharedCountInTop10} Shared
            </Badge>
          )}
          <Button 
            variant="filled" 
            size="sm"
            leftSection={<IconDownload size={16} />}
            onClick={downloadCSV}
            color="green"
            style={{ height: '32px' }}
          >
            Download CSV
          </Button>
        </Group>
      </div>

      {/* Scrollable container for the table */}
      <ScrollArea 
        type="auto" 
        offsetScrollbars 
        styles={{
          root: {
            overflowX: 'auto',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          },
          scrollbar: {
            '&[data-orientation="horizontal"]': {
              height: '10px',
            },
          }
        }}
      >
        <div style={{ minWidth: '750px' }}>
          <Table className="leaderboard-table" verticalSpacing="md">
            <thead>
              <tr>
                <th style={{ width: '60px' }}> {/* Reduced from 80px */}
                  <Button 
                    variant="subtle" 
                    size="compact-sm"
                    rightSection={getSortIcon('rank')}
                    onClick={() => handleSort('total')}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    Rank
                  </Button>
                </th>
                <th style={{ minWidth: '250px' }}>
                  <Button 
                    variant="subtle" 
                    size="compact-sm"
                    rightSection={getSortIcon('name')}
                    onClick={() => handleSort('name')}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    Candidate
                  </Button>
                </th>
                <th style={{ width: '80px' }}> {/* Reduced from 120px */}
                  <Button 
                    variant="subtle" 
                    size="compact-sm"
                    rightSection={getSortIcon('experience')}
                    onClick={() => handleSort('experience')}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    Experience
                  </Button>
                </th>
                <th style={{ width: '100px' }}> {/* Reduced from 120px */}
                  <Button 
                    variant="subtle" 
                    size="compact-sm"
                    rightSection={getSortIcon('total')}
                    onClick={() => handleSort('total')}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    Total Score
                  </Button>
                </th>
                <th style={{ width: '90px' }}> {/* Reduced from 100px */}
                  Status
                </th>
                <th style={{ width: '70px' }}> {/* Reduced from 80px */}
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {top10.map((c, idx) => (
                <tr key={c.id} className={idx < 3 ? 'top-three' : ''}>
                  <td>
                    <div className={`rank-badge rank-${idx + 1}`} style={{ width: '32px', height: '32px' }}>
                      {getRankIcon(idx + 1)}
                    </div>
                  </td>
                  <td>
                    <div className="candidate-info">
                      <Avatar 
                        size="md" 
                        radius="xl"
                        src={`https://i.pravatar.cc/150?img=${c.id}`}
                        alt={c.name}
                      />
                      <div>
                        <div className="candidate-name">{c.name}</div>
                        <div className="candidate-skills">
                          {c.skills.slice(0, 2).map((skill, i) => (
                            <Badge key={i} size="xs" color="blue" variant="light">
                              {skill}
                            </Badge>
                          ))}
                          {c.skills.length > 2 && (
                            <Badge size="xs" color="gray">+{c.skills.length - 2}</Badge>
                          )}
                          {sharedCandidates && sharedCandidates.has(c.id) && (
                            <Badge size="xs" color="green" variant="dot">
                              Shared
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="experience-cell">
                      <span className="years" style={{ fontSize: '1.1rem' }}>{c.experience_years}</span>
                      <span className="years-label" style={{ fontSize: '0.8rem' }}>yrs</span>
                    </div>
                  </td>
                  <td>
                    <div className="score-display">
                      <div className="score-value" style={{ fontSize: '1.3rem' }}>{c.total}</div>
                      <div className="score-max" style={{ fontSize: '0.8rem' }}>/300</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Badge 
                        color={
                          c.total >= 250 ? 'green' :
                          c.total >= 200 ? 'yellow' : 'gray'
                        }
                        variant="light"
                        size="sm"
                      >
                        {c.total >= 250 ? 'Top' : c.total >= 200 ? 'Good' : 'Average'}
                      </Badge>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip label="Share with HR team">
                        <ActionIcon
                          variant="light"
                          color={sharedCandidates && sharedCandidates.has(c.id) ? "green" : "blue"}
                          onClick={() => onShareCandidate && onShareCandidate(c)}
                          size="sm"
                        >
                          <IconShare size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </ScrollArea>
      
      {/* Show search results count */}
      {searchQuery && (
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#718096', fontSize: '0.875rem' }}>
          Showing {top10.length} of {candidates.length} candidates matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}

export default Leaderboard;