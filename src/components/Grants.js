import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/system';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import  useDebouncedEffect  from  'use-debounced-effect';


import { getCrossRefGrantData, getDataCiteGrantData } from '../api';

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

export default function Grants(props) {

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");

  const loading = open && options.length === 0;


  const handleChange = (e, value) => { 
    props.onStateChange(value); 
  };
	{/*
  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await getGrantData(props).then(data=>{
        setOptions([...data]);
      });
    })();

    return () => {
      active = false;
   };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
*/}
  let trigger_limit = 3;
  // if we are funnelling start the search without text...?
  if(props.partOrgs?.length){
      trigger_limit = 0;
//      setOpen(true);
  }
  console.log("TRIGGER_LIMIT: ", trigger_limit);
  useDebouncedEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    if (searchText.length >= trigger_limit) {
      console.log("triggering...");
      // Search two datasources!
      const cr = async () => {
        return getCrossRefGrantData(props,searchText)
      }
      const dc = async () => {
	  return getDataCiteGrantData(props,searchText)
      }
      (async () => {
        Promise.all([cr(),dc()]).then((data) => { 
	  // TODO these take a while and won't finish until the last one is done...
	  // but when they are done we munge together :)
          setOptions([...data.flat(1)]);
        });
      })();

/*
      (async () => {
        await getCrossRefGrantData(props,searchText).then(data=>{
          setOptions([...data]);
        }).catch((e) => console.log(e));
        await getDataCiteGrantData(props,searchText).then(data=>{
          setOptions([...data]);
        }).catch((e) => console.log(e));
      })();
  */    
    }
  }, 1000, [searchText]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

 
  return (
    <Grid container spacing={3}>
      <FormGrid item xs={12} key="grant">
        <Autocomplete
          multiple
          id="grants-input"
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          options={options}
          loading={loading}
          onChange={handleChange}
          onInputChange={(e) => setSearchText(e.target.value)}
          filterSelectedOptions
          freeSolo
          disableCloseOnSelect
          isOptionEqualToValue={(option, value) => option.title === value.title}
          getOptionLabel={(option) => `${option.title}: ${option.publisher}/${option.sub}`}
          renderOption={(props, option) => {
            return (
	      <li {...props} key={option.title+option.sub}>
                {option.title}: {option.publisher}/{option.sub}
	      </li>
	    )
	  }}
        renderTags={(tagValue, getTagProps) => {
	  let tag = tagValue.map((option, index) => {
            let avatar=<Avatar alt={option.title} src='avatars/money.png' title="Pound icons created by NajmunNahar"/>
            let label = `${option.publisher}/${option.title}`
            return <Chip {...getTagProps({ index })} 
		  key={option.title + index} 
		  label={label}
		  variant="outlined"
		  avatar={avatar}
		  />
	  })
	  return tag
	}}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Grants"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </FormGrid> 
    </Grid>
  );
}

