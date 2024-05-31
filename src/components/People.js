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

import { credit, CreditRole, CreditDescriptions } from 'credit-roles';
import { getPeopleData, getLogos } from '../api';


const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));


	/* 
          <FormGrid item xs={12} key={key}>
            <Autocomplete label={CreditRole[key]} data={getPeopleData()} role={credit.buildUrl(CreditRole[key])} onStateChange={props.onStateChange}/>
          </FormGrid> 
*/

export default function People(props) {


  return (
    <Grid container spacing={3}>
      {Object.keys(CreditRole).reverse().map((key) =>
        <PersonAC 
              key={"people-"+key}
	      onAuthPeopleChange={props.onAuthPeopleChange} 
	      label={CreditRole[key]} 
	      role={key} 
              userContext={key == 'WritingOriginalDraft' ? props.userContext : null }
              props={props}
	      />
      )}
    </Grid>
  );
}

export function PersonAC(props) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [options, setOptions] = React.useState([]);

  const handleChange = (value, role) => { 
    //TODO make less naff
//    if (role === 'funder'){
      props.onAuthPeopleChange(value); 
//    }

  };

  useDebouncedEffect(() => {
/* This is a bit awkwrd
    if(props.userContext) {
      console.log("userContext: ",props.userContext);
      setOptions([props.userContext])
      setOpen(true)
    }
    */
    if (searchText?.length >= 3) {
      (async () => {
        await getPeopleData(props.props, searchText, props.role).then(data=>{
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
      <FormGrid item xs={12} key={props.role+"_person"}>
        <Autocomplete
          multiple
          id={"person-"+props.role+"-input"}
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
                {option.title + " (" + option.affiliation + ")"}
	      </li>
	    )
	  }}
        renderTags={(tagValue, getTagProps) => {
	  let tag = tagValue.map((option, index) => {

            let avatar = <Avatar 
		         alt={option.title ? option.title : option} 
		         src={option.orcid ? getLogos()['https://ror.org/04fa4r544'] : option }
		        />
          
            return <Chip {...getTagProps({ index })} 
		  key={option.ror ? option.ror : option} 
		  label={option.title ? option.title : option}
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

