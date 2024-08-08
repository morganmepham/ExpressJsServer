import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import useAxios from '../hooks/useAxios';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function Sidebar() {
  // const theme = useTheme();
  const { post } = useAxios();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleDrawerChange = (newValue) => {
    setOpen(newValue);
  };
  const handleLogout = async () => {
    try {
      const result = await post('/logout');
      console.log(result);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const sidebarTopEntries = [
    { text: 'Home', icon: <HomeIcon /> },
    { text: 'Templates', icon: <NoteAddIcon /> },
    { text: 'Workouts', icon: <FitnessCenterIcon /> },
  ];

  const sidebarBottomEntries = [
    { text: 'Settings', icon: <SettingsIcon /> },
    { text: 'Log Out', icon: <LogoutIcon /> },
  ];

  const [selected, setSelected] = React.useState('home');

  React.useEffect(() => {
    if (window.location.pathname.endsWith('/home')) {
      setSelected('home');
    } else if (window.location.pathname.endsWith('/templates')) {
      setSelected('templates');
    } else if (window.location.pathname.endsWith('/workouts')) {
      setSelected('workouts');
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton
            onClick={() => {
              handleDrawerChange(!open);
            }}
          >
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <List sx={{ width: '100%' }}>
            {sidebarTopEntries.map((entry) => (
              <ListItem key={entry.text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  selected={selected === entry.text.toLocaleLowerCase()}
                  onClick={() => {
                    setSelected(entry.text.toLocaleLowerCase());
                    navigate(`/${entry.text.toLocaleLowerCase()}`);
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {entry.icon}
                  </ListItemIcon>
                  <ListItemText primary={entry.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {open && (
            <List sx={{ width: '100%' }}>
              {sidebarBottomEntries.map((entry) => (
                <ListItem key={entry.text} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={entry.text === 'Log Out' ? handleLogout : () => {}}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {entry.icon}
                    </ListItemIcon>
                    <ListItemText primary={entry.text} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </Drawer>
    </Box>
  );
}
