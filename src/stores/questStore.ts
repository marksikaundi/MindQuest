import { create } from 'zustand';

type QuestState = {
  claimedIds: string[];
};

export const initialQuestState = (): QuestState => ({ claimedIds: [] });

export const useQuestStore = create<QuestState>(() => initialQuestState());
