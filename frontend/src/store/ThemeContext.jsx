import { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { updateStudentTheme } from '../services/studentServices';
import { updateAdminTheme } from '../services/adminServices';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);

  const studentProfile = useSelector((state) => state.student.profile);
  const adminProfile = useSelector((state) => state.admin.profile);

  // Load theme from API when user logs in
  useEffect(() => {
    const loadThemeFromAPI = async () => {
      if (studentProfile && studentProfile.theme) {
        setTheme(studentProfile.theme);
      } else if (adminProfile && adminProfile.theme) {
        setTheme(adminProfile.theme);
      } else {
        // Fallback to localStorage if no profile loaded yet
        const savedTheme = localStorage.getItem('hostelhub-theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setTheme(savedTheme);
        }
      }
    };

    loadThemeFromAPI();
  }, [studentProfile, adminProfile]);

  // Apply theme to document body
  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
  }, [theme]);

  const toggleTheme = async () => {
    if (isLoading) return;

    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setIsLoading(true);

    try {
      let result;
      if (studentProfile) {
        result = await updateStudentTheme(newTheme);
      } else if (adminProfile) {
        result = await updateAdminTheme(newTheme);
      }

      if (result && result.message === 'Theme updated successfully') {
        setTheme(newTheme);
        localStorage.setItem('hostelhub-theme', newTheme); // Backup in localStorage
      } else {
        console.error('Failed to update theme:', result);
        // Still update locally as fallback
        setTheme(newTheme);
        localStorage.setItem('hostelhub-theme', newTheme);
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      // Still update locally as fallback
      setTheme(newTheme);
      localStorage.setItem('hostelhub-theme', newTheme);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
