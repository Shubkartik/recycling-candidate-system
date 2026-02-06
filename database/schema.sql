-- ================================
-- Candidates Table
-- ================================
CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL,
    skills TEXT
);

-- ================================
-- Evaluations Table
-- ================================
CREATE TABLE evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    crisis_management INT CHECK (crisis_management BETWEEN 0 AND 100),
    sustainability INT CHECK (sustainability BETWEEN 0 AND 100),
    team_motivation INT CHECK (team_motivation BETWEEN 0 AND 100),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

-- ================================
-- Rankings Table
-- ================================
CREATE TABLE rankings (
    candidate_id INT PRIMARY KEY,
    total_score INT,
    rank_position INT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

-- ================================
-- Trigger to auto-update rankings
-- ================================
DELIMITER $$

CREATE TRIGGER update_rankings
AFTER INSERT ON evaluations
FOR EACH ROW
BEGIN
    INSERT INTO rankings (candidate_id, total_score)
    VALUES (
        NEW.candidate_id,
        NEW.crisis_management + NEW.sustainability + NEW.team_motivation
    );
END$$

DELIMITER ;