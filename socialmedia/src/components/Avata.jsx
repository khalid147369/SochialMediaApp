import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import useChangeMenu from '../hooks/usechangeMenu';

export default function Avata({ isClicked, content, imageSrc = '' }) {
  Avata.propTypes = {
    isClicked: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
  };
const {setSelectedKey} = useChangeMenu();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [navigateTo, setNavigateTo] = React.useState(null);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    if (navigateTo) {
      navigate(navigateTo);
      setNavigateTo(null);
    }
  }, [navigateTo, navigate]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (options) => {
    setAnchorEl(null);
    isClicked();
    switch (options) {
      case "account":
        setNavigateTo('/register');
        break;
      case "profile":
        setSelectedKey(0)
        setNavigateTo('/Profile');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    cookies.remove('token');
    cookies.remove('refreshToken');
    navigate('/login');
  };

  if (!content) {
    content = "";
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }} >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            className='w-fit'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }} src={imageSrc} className={" border-gray-600 border rounded-full w-10 h-10 "}>{content[0]}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleClose("profile")}>
          <Avatar src={imageSrc} /> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleClose("account")}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}