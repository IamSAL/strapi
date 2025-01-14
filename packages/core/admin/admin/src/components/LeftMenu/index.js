import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { NavLink as Link } from 'react-router-dom';
import { Divider } from '@strapi/design-system/Divider';
import {
  MainNav,
  NavBrand,
  NavSections,
  NavLink,
  NavSection,
  NavUser,
  NavCondense,
} from '@strapi/design-system/MainNav';
import { FocusTrap } from '@strapi/design-system/FocusTrap';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import Write from '@strapi/icons/Write';
import Exit from '@strapi/icons/Exit';
import { auth, usePersistentState, useAppInfos } from '@strapi/helper-plugin';
import useConfigurations from '../../hooks/useConfigurations';

const LinkUserWrapper = styled(Box)`
  width: ${150 / 16}rem;
  position: absolute;
  bottom: ${({ theme }) => theme.spaces[9]};
  left: ${({ theme }) => theme.spaces[5]};
`;

const LinkUser = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[4]}`};
  border-radius: ${({ theme }) => theme.spaces[1]};

  &:hover {
    background: ${({ theme, logout }) =>
      logout ? theme.colors.danger100 : theme.colors.primary100};
    text-decoration: none;
  }

  svg {
    path {
      fill: ${({ theme }) => theme.colors.danger600};
    }
  }
`;

const LeftMenu = ({ generalSectionLinks, pluginsSectionLinks }) => {
  const buttonRef = useRef();
  const [userLinksVisible, setUserLinksVisible] = useState(false);
  const { menuLogo } = useConfigurations();
  const [condensed, setCondensed] = usePersistentState('navbar-condensed', false);
  const { userDisplayName } = useAppInfos();
  const { formatMessage } = useIntl();

  const initials = userDisplayName
    .split(' ')
    .map(name => name.substring(0, 1))
    .join('')
    .substring(0, 2);

  const handleToggleUserLinks = () => setUserLinksVisible(prev => !prev);

  const handleLogout = () => {
    auth.clearAppStorage();
    handleToggleUserLinks();
  };

  const handleBlur = e => {
    if (
      !e.currentTarget.contains(e.relatedTarget) &&
      e.relatedTarget?.parentElement?.id !== 'main-nav-user-button'
    ) {
      setUserLinksVisible(false);
    }
  };

  const menuTitle = formatMessage({
    id: 'app.components.LeftMenu.navbrand.title',
    defaultMessage: 'Alienide Interactive',
  });

  return (
    <MainNav condensed={condensed}>
      <NavBrand
        workplace={formatMessage({
          id: 'app.components.LeftMenu.navbrand.workplace',
          defaultMessage: 'Website CMS',
        })}
        title={menuTitle}
        icon={<img src={menuLogo} alt={menuTitle} />}
      />

      <Divider />

      <NavSections>
        <NavLink to="/content-manager" icon={<Write />}>
          {formatMessage({ id: 'content-manager.plugin.name', defaultMessage: 'Content manager' })}
        </NavLink>

        {pluginsSectionLinks.length > 0 ? (
          <NavSection label="Plugins">
            {pluginsSectionLinks.map(link => {
              const Icon = link.icon;

              return (
                <NavLink to={link.to} key={link.to} icon={<Icon />}>
                  {formatMessage(link.intlLabel)}
                </NavLink>
              );
            })}
          </NavSection>
        ) : null}

        {generalSectionLinks.length > 0 ? (
          <NavSection label="General">
            {generalSectionLinks.map(link => {
              const LinkIcon = link.icon;

              return (
                <NavLink
                  badgeContent={
                    (link.notificationsCount > 0 && link.notificationsCount.toString()) || undefined
                  }
                  to={link.to}
                  key={link.to}
                  icon={<LinkIcon />}
                >
                  {formatMessage(link.intlLabel)}
                </NavLink>
              );
            })}
          </NavSection>
        ) : null}
      </NavSections>

      <NavUser
        id="main-nav-user-button"
        ref={buttonRef}
        onClick={handleToggleUserLinks}
        initials={initials}
      >
        {userDisplayName}
      </NavUser>
      {userLinksVisible && (
        <LinkUserWrapper
          onBlur={handleBlur}
          padding={1}
          shadow="tableShadow"
          background="neutral0"
          hasRadius
        >
          <FocusTrap onEscape={handleToggleUserLinks}>
            <Stack size={0}>
              <LinkUser tabIndex={0} onClick={handleToggleUserLinks} to="/me">
                <Typography>
                  {formatMessage({
                    id: 'app.components.LeftMenu.profile',
                    defaultMessage: 'Profile',
                  })}
                </Typography>
              </LinkUser>
              <LinkUser tabIndex={0} onClick={handleLogout} logout="logout" to="/auth/login">
                <Typography textColor="danger600">
                  {formatMessage({
                    id: 'app.components.LeftMenu.logout',
                    defaultMessage: 'Logout',
                  })}
                </Typography>
                <Exit />
              </LinkUser>
            </Stack>
          </FocusTrap>
        </LinkUserWrapper>
      )}

      <NavCondense onClick={() => setCondensed(s => !s)}>
        {condensed
          ? formatMessage({
              id: 'app.components.LeftMenu.expand',
              defaultMessage: 'Expand the navbar',
            })
          : formatMessage({
              id: 'app.components.LeftMenu.collapse',
              defaultMessage: 'Collapse the navbar',
            })}
      </NavCondense>
    </MainNav>
  );
};

LeftMenu.propTypes = {
  generalSectionLinks: PropTypes.array.isRequired,
  pluginsSectionLinks: PropTypes.array.isRequired,
};

export default LeftMenu;
