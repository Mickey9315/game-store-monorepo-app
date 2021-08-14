import * as React from 'react';
import { FiChevronDown, FiArrowLeft } from 'react-icons/fi';
import { CgDarkMode } from 'react-icons/cg';
import Helmet from 'react-helmet';
import Button from 'src/components//Button';
import Dropdown, { DropdownItem } from 'src/components//Dropdown';
import { ThemeContext, ThemeValue } from 'src/context/theme';
import cn from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { NavigationContext } from 'src/context/navigation';

type NavigationBarProps = {
  isSticky?: boolean;
};

const NavigationBar: React.FC<NavigationBarProps> = ({ isSticky }) => {
  const { goBack, replace, length } = useHistory();
  const { pathname } = useLocation();
  console.log('🚀 ~ file: NavigationBar.tsx ~ line 19 ~ pathname', pathname);
  const { changeTheme, theme, themeList } = React.useContext(ThemeContext);
  const { title } = React.useContext(NavigationContext);
  const navbarClass = cn({
    sticky: isSticky,
  });

  const isRoot = pathname === '/' || pathname === '/genres';
  const canGoBack = length > 2;

  const onBackButtonClick = () => {
    if (!canGoBack) {
      replace('/');
      return;
    }

    goBack();
  };

  const onThemeChange = React.useCallback(
    (theme: ThemeValue) => {
      return () => {
        changeTheme(theme);
      };
    },
    [changeTheme],
  );

  const themeDropdownItems = React.useMemo((): DropdownItem[] | null => {
    if (!themeList) {
      return null;
    }

    return themeList?.map(({ icon, label, value }) => {
      return {
        title: (
          <div>
            <span className="mr-3">{icon}</span>
            {label}
          </div>
        ),
        onClick: onThemeChange(value),
        className: cn({
          active: theme === value,
        }),
      };
    });
  }, [onThemeChange, theme, themeList]);

  const renderThemeDropDown = () => {
    if (!themeDropdownItems) {
      return null;
    }

    return (
      <Dropdown items={themeDropdownItems} trigger="hover" className="max-h-96">
        <Button isRounded isGhost className="px-0" size="small">
          <div className="flex items-center">
            <CgDarkMode size={22} className="mx-1" />
          </div>
          <div className="flex items-center">
            <FiChevronDown size="22" />
          </div>
        </Button>
      </Dropdown>
    );
  };

  return (
    <div className={cn('navbar w-full bg-neutral text-neutral-content justify-between top-0 z-10', navbarClass)}>
      <div className="w-[80%]">
        <div className="mr-3">
          {isRoot ? null : (
            <Button isSquare isGhost size="small" onClick={onBackButtonClick}>
              <FiArrowLeft size={24} />
            </Button>
          )}
        </div>
        <p className="text-lg font-bold truncate">{title}</p>
      </div>
      <div>{renderThemeDropDown()}</div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
    </div>
  );
};

export default NavigationBar;
