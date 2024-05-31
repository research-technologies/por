import * as React from 'react';

import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/system';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';


import  useDebouncedEffect  from  'use-debounced-effect';

import { getCrossRefOutputData, getLogos } from '../api';



const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));


  
export default function Outputs (props) {

  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [options, setOptions] = React.useState([]);

  const handleChange = (value, role) => { 
    //TODO make less naff
      props.onOutputsChange(value); 
  };


  useDebouncedEffect(() => {
//    if (searchText.length >= 3) {
      (async () => {
        await getCrossRefOutputData(props, searchText).then(data=>{
          setOptions([...data]);
        }).catch((e) => console.log(e));
      })();
//    }
  }, 1000, [searchText]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

	
  return (
      <FormGrid item xs={12} key="output">
        <Autocomplete
          multiple
          id={"output-input"}
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
          disableCloseOnSelect
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

