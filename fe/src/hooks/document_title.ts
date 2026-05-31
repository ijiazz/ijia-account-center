import { useEffect } from "react";

export function setDocumentTitle(title: string) {
  document.title = title;
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const oldTitle = document.title;
    return () => {
      document.title = oldTitle;
    };
  }, []);
  useEffect(() => {
    setDocumentTitle(title);
  }, [title]);
}
