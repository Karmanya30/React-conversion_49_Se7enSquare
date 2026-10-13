import { useState, useCallback } from 'react';

/**
 * Custom hook tracking dirty form state across community settings edits.
 */
export default function useDirtyForm(initial = false) {
  const [isDirty, setIsDirty] = useState(initial);

  const markDirty = useCallback(() => setIsDirty(true), []);
  const markClean = useCallback(() => setIsDirty(false), []);

  return { isDirty, setIsDirty, markDirty, markClean };
}
