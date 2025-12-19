// pages/test-minimal.tsx
import { TeamProvider } from '../context/TeamContext';
import GroupStageFixtures from '../components/GroupStageFixtures';

export default function TestMinimal() {
  return (
    <TeamProvider>
      <div style={{ padding: '2rem' }}>
        <h1>Minimal Test Page</h1>
        <p>Testing if GroupStageFixtures component works...</p>
        <GroupStageFixtures />
      </div>
    </TeamProvider>
  );
}
