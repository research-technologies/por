'use client'
import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import People from './People';
import Projects from './Projects';
import Grants from './Grants';
import Outputs from './Outputs';
import Organisations from './Organisations';

import Info from './Info';
import InfoMobile from './InfoMobile';


/* NB at some stage we are going to want draggable stuff somewhere.. like this:
 *
 * https://react-dnd.github.io/react-dnd/examples 
 *
 * Or this : https://github.com/atlassian/react-beautiful-dnd
 *
 * here's an example of the latter
 * https://codesandbox.io/p/sandbox/draggable-material-ui-oj3wz?file=%2Fsrc%2FApp.tsx
 *
 * */
// Imagine like we get hsi stuff at log in
const userContext = {title: 'Rory McNicholl', orcid: '0000-0001-7918-6597', role: 'WritingOriginalDraft', affiliation: "University of London" };
const orgContext = {title: 'University of London', ror: 'https://ror.org/04cw6st05', types: ['education', 'funder']};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
        <Box 
	  sx={{ p: 3 }}
	  hidden={value !== index}
	  >
          {children}
        </Box>
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [partOrgs, setPartOrgs] = React.useState([]);
  const [fundOrgs, setFundOrgs] = React.useState([]);

  const [authPeople, setAuthPeople] = React.useState([]);

  const [grants, setGrants] = React.useState([]);

  const [outputs, setOutputs] = React.useState([]);

  const handlePartOrgsChange = (value) => {
      setPartOrgs(value);
  };
  const handleFundOrgsChange = (value) => {
      setFundOrgs(value);
  };

  const handleAuthPeopleChange = (value) => {
      setAuthPeople(value);
  };

  const handleGrantsChange = (value) => {
      setGrants(value);
  };

  const handleOutputsChange = (value) => {
      setOutputs(value);
  };


  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container sx={{ height: { xs: '100%', sm: '100dvh' }}}>
        <Grid
          item
          xs={12}
          sm={5}
          lg={8}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRight: { sm: 'none', md: '1px solid' },
            borderColor: { sm: 'none', md: 'divider' },
            alignItems: 'start',
            pt: 4,
            px: 10,
            gap: 4,
          }}
        >
    <Box sx={{ width: '100%' }}>
    <Typography component="h1" variant="h3" sx={{ mb: 2 }}>
      Welcome, {userContext.title}<br/>
      <Typography component="subtitle1" sx={{ mb: 2 }}>{userContext.orcid}</Typography>
    </Typography>


      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Organisations" {...a11yProps(0)} />
          <Tab label="Grants" {...a11yProps(1)} />
          <Tab label="Projects" {...a11yProps(2)} />
          <Tab label="People" {...a11yProps(3)} />
          <Tab label="Outputs" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Organisations onPartChange={handlePartOrgsChange} onFundChange={handleFundOrgsChange} orgContext={orgContext}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grants onStateChange={handleGrantsChange} orgs={partOrgs}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Projects/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <People onAuthPeopleChange={handleAuthPeopleChange} orgs={partOrgs} userContext={userContext} authPeople={authPeople}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Outputs onOutputsChange={handleOutputsChange} authPeople={authPeople} partOrgs={partOrgs} fundOrgs={fundOrgs}/>
      </CustomTabPanel>
    </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={5}
        lg={4}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          backgroundColor: 'background.paper',
          borderRight: { sm: 'none', md: '1px solid' },
          borderColor: { sm: 'none', md: 'divider' },
          alignItems: 'start',
          pt: 4,
          px: 10,
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            width: '100%',
            maxWidth: 500,
          }}
        >
	  <Info partOrgs={partOrgs} fundOrgs={fundOrgs} authPeople={authPeople} grants={grants} outputs={outputs} onAuthPeopleChange={handleAuthPeopleChange} />
        </Box>
      </Grid>
    </Grid>
  </React.Fragment>

  );
}
