import { faker } from '@faker-js/faker';
import fs from 'fs';

const outputDir = './data';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const candidates = [];

for (let i = 1; i <= 40; i++) {
  candidates.push({
    id: i,
    name: faker.person.fullName(),
    experience_years: faker.number.int({ min: 1, max: 15 }),
    skills: faker.helpers.arrayElements(
      ['Recycling', 'Operations', 'Sustainability', 'Leadership', 'Safety'],
      3
    ),
    crisis_management: faker.number.int({ min: 50, max: 100 }),
    sustainability: faker.number.int({ min: 50, max: 100 }),
    team_motivation: faker.number.int({ min: 50, max: 100 })
  });
}

fs.writeFileSync(
  `${outputDir}/candidates.json`,
  JSON.stringify(candidates, null, 2)
);

console.log('✅ 40 candidates generated successfully');