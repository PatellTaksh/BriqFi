import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const LAST_VISITED_PAGE_KEY = 'briqfi_last_visited_page';

export function useNavigationState() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Save the current page to localStorage when navigating
  useEffect(() => {
    // Don't save account or auth-related pages as "last visited"
    if (!loading && location.pathname !== '/account' && location.pathname !== '/reset-password') {
      localStorage.setItem(LAST_VISITED_PAGE_KEY, location.pathname);
    }
  }, [location.pathname, loading]);

  // Get the last visited page
  const getLastVisitedPage = () => {
    return localStorage.getItem(LAST_VISITED_PAGE_KEY) || '/';
  };

  // Navigate to last visited page
  const navigateToLastVisited = () => {
    const lastPage = getLastVisitedPage();
    navigate(lastPage);
  };

  // Clear last visited page (useful on logout)
  const clearLastVisited = () => {
    localStorage.removeItem(LAST_VISITED_PAGE_KEY);
  };

  return {
    getLastVisitedPage,
    navigateToLastVisited,
    clearLastVisited,
    currentPath: location.pathname
  };
}