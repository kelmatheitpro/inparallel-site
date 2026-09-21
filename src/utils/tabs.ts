export interface TabItem {
  /** Slug tying a tab to its `<TabPanel>`. */
  id: string;
  label: string;
}

/**
 * Which tab a set opens on.
 *
 * Shared so the `<TabPanel>`s a caller renders beside `<Tabs>` agree with the
 * tab strip without repeating the fallback rule.
 */
export const activeTab = (tabs: TabItem[], want?: string) =>
  want && tabs.some((tab) => tab.id === want) ? want : tabs[0]?.id;
