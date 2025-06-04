export type JournalEntryType = "analysis" | "trade";

export interface JournalEntry {
  id: string;
  scripId: string;
  type: JournalEntryType;
  content: string;
  createdAt: string;
  updatedAt: string;
} 