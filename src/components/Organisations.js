import * as React from 'react';

//import Checkbox from '@mui/material/Checkbox';
//import FormControlLabel from '@mui/material/FormControlLabel';
//import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/system';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import  useDebouncedEffect  from  'use-debounced-effect';

import { getOrganisationsData, getLogos } from '../api';

//import { getLogos } from '../api';

var getInitials = function (name) {
  var parts = name.split(' ')
  var initials = ''
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].length > 0 && parts[i] !== '') {
      initials += parts[i][0]
    }
  }
  return initials
}

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function Organisations(props) {

  return (
    <Grid container spacing={3}>
      <OrganisationsAC onPartChange={props.onPartChange} role="participant" label="Participating Organisations" filter={[]} orgContext={props.orgContext}/>
      <OrganisationsAC onFundChange={props.onFundChange} role="funder" label="Funder Organisations" filter={[{types: 'funder'}]} />
    </Grid>
  );

}

export function OrganisationsAC(props) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [options, setOptions] = React.useState([]);

  const handleChange = (value, role) => { 
    //TODO make less naff
    if (role === 'funder'){
      props.onFundChange(value); 
    }
    if (role === 'participant'){
      props.onPartChange(value); 
    }

  };


  useDebouncedEffect(() => {
/*
    if(props.orgContext) {
      setOptions([props.orgContext])
      setOpen(true)
    }
    */
    if (searchText.length >= 3) {
      (async () => {
        await getOrganisationsData(props.filter, searchText, props.role).then(data=>{
          setOptions([...data]);
        }).catch((e) => console.log(e));
      })();
    }
  }, 1000, [searchText]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

	
  return (
      <FormGrid item xs={12} key={props.role+"_org"}>
        <Autocomplete
          multiple
          id={"orgs-"+props.role+"-input"}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          options={options}
          onChange={(event, value) => handleChange(value, props.role)}
          onInputChange={(e) => setSearchText(e.target.value)}
          filterSelectedOptions
          freeSolo
          isOptionEqualToValue={(option, value) => option.title === value.title}
          getOptionLabel={(option) => option.title || ""}
          renderOption={(props, option) => {
            return (
	      <li {...props} key={option.title}>
                {option.title}
	      </li>
	    )
	  }}
        renderTags={(tagValue, getTagProps) => {
	  let tag = tagValue.map((option, index) => {
            let avatar = <Avatar 
		         alt={option.title} 
		         src={getLogos()[option.ror]} 
		        />
            return <Chip {...getTagProps({ index })} 
		  key={option.title + index} 
		  label={option.title}
		  variant="outlined"
		  avatar={avatar}
		  />
	  })
	  return tag
	}}
          renderInput={(params) => (
            <TextField
              {...params}
              label={props.label}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {/*loading ? <CircularProgress color="inherit" size={20} /> : null*/}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </FormGrid> 
  );
}

