import { useEffect } from 'react';

export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    const baseTitle = 'Codexa — Engineering Curricula & Practice';
    if (title) {
      document.title = `${title} · Codexa`;
    } else {
      document.title = baseTitle;
    }
  }, [title]);
};

export default useDocumentTitle;
