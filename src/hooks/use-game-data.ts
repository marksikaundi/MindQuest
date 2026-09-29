import { useMemo } from 'react';

import { ACHIEVEMENTS } from '@/data/achievements';
import { getDailyChallenge } from '@/data/daily';
import { QUESTS } from '@/data/quests';
import { REGIONS } from '@/data/regions';
import { isRegionUnlocked } from '@/game/actions';
import { useGameStore } from '@/stores/gameStore';
import { useQuestStore } from '@/stores/questStore';
import type { Quest } from '@/types/game';

export function useQuestBoard(): Quest[] {
  const stats = useGameStore((state) => state.stats);
  const claimedIds = useQuestStore((state) => state.claimedIds);
  return useMemo(
    () =>
      QUESTS.map((quest) => ({
        ...quest,
        completed: claimedIds.includes(quest.id),
        objectives: quest.objectives.map((objective) => ({
          ...objective,
          current: Math.min(objective.target, stats[objective.event] ?? 0),
        })),
      })),
    [claimedIds, stats],
  );
}

export function useRegionViews() {
  const stats = useGameStore((state) => state.stats);
  const visited = useGameStore((state) => state.visitedRegions);
  const claimedIds = useQuestStore((state) => state.claimedIds);
  return useMemo(() => {
    const completed = claimedIds.length;
    return REGIONS.map((region) => {
      const unlocked = region.unlock.type === 'always' || completed >= region.unlock.count;
      let label = '';
      let value = 0;
      if (region.id === 'puzzle-valley') {
        const count = Math.min(5, stats.complete_puzzle ?? 0);
        label = `${count}/5`;
        value = count / 5;
      } else if (region.id === 'adventure-forest') {
        const count = Math.min(5, stats.find_hidden_object ?? 0);
        label = `${count}/5`;
        value = count / 5;
      } else if (region.id === 'questland') {
        const steps = ['explore_village', 'visit_great_tree', 'open_world_map'] as const;
        const count = steps.filter((event) => (stats[event] ?? 0) > 0).length;
        label = `${count}/3`;
        value = count / 3;
      } else if (visited.includes(region.id)) {
        value = 1;
      }
      return { ...region, unlocked, progressLabel: label, progressValue: value };
    });
  }, [claimedIds, stats, visited]);
}

export function useAchievementViews() {
  const stats = useGameStore((state) => state.stats);
  const claimed = useGameStore((state) => state.claimedAchievementIds);
  const visitedRegions = useGameStore((state) => state.visitedRegions);
  const questClaimed = useQuestStore((state) => state.claimedIds);
  return useMemo(() => {
    const unlockedRegionIds = REGIONS.filter((region) => isRegionUnlocked(region.id)).map((region) => region.id);
    return ACHIEVEMENTS.map((achievement) => {
      const progress = achievement.progress({
        stats,
        questsCompleted: questClaimed.length,
        visitedRegions,
        unlockedRegionIds,
      });
      return { ...achievement, ...progress, unlocked: claimed.includes(achievement.id) };
    });
  }, [claimed, questClaimed.length, stats, visitedRegions]);
}

export function useDailyView() {
  const daily = useGameStore((state) => state.daily);
  const definition = getDailyChallenge(daily.challengeId);
  return {
    ...definition,
    progress: Math.min(definition.target, daily.progress),
    claimed: daily.claimed,
    date: daily.date,
  };
}
