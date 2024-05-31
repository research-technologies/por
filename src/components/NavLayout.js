import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MainMenu from '@/components/MainMenu';

const drawerWidth = 240;

function NavLayout(props) {
  const content = props.content;
  content.userContext = props.userContext
  content.orgContext = props.orgContext

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <MainMenu userContext={props.userContext} orgContext={props.orgContext} />
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}

NavLayout.propTypes = {
	  /**
	   *    * Injected by the documentation to work in an iframe.
	   *       * You won't need it on your project.
	   *          */
	  window: PropTypes.func,
};

export default NavLayout;
