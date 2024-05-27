import { useCallback } from 'react';
import useShowToast from './useShowToast';

const useCopyLink = () => {
  const showToast = useShowToast();

  const copyURL = useCallback((path) => {
    const link = `${window.location.origin}/${path}`;
    
    navigator.clipboard.writeText(link)
      .then(() => {
        showToast("Success", "Link Copied", "success");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        showToast("Error", "Failed to copy link", "error");
      });
  }, [showToast]);

  return { copyURL };
};

export default useCopyLink;
