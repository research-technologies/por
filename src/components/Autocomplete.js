'use client'
import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';

import { getLogos } from '../api';

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


export default function Tags(props) {

  const handleChange = (e, value) => { 
    props.onStateChange(value); 
  };

  return (
      <Autocomplete
        multiple
        id="tags-outlined"
        options={props.data}
        onChange={handleChange}
        getOptionLabel={(option) => option.title}
        filterSelectedOptions
        freeSolo
        renderOption={(props, option) => {
	  return (
	    <li {...props} key={option.title}>
	      {option.title}
	    </li>
	  )
	}}
        renderTags={(tagValue, getTagProps) => {
	  let tag = tagValue.map((option, index) => {
            let avatar=<Avatar alt={option.title}>{getInitials(option.title)}</Avatar>
            if(option.orcid){
              avatar = <Avatar 
		         alt={option.title} 
		         src={getLogos()['https://ror.org/04fa4r544']} 
		        />
	    }else if(option.ror){
              avatar = <Avatar 
		         alt={option.title} 
		         src={getLogos()[option.ror]} 
		        />
	    }
            return <Chip {...getTagProps({ index })} 
		  key={option.title + index} 
		  label={option.title} 
                  variant="outlined"
		  avatar={avatar}
		  />
	  })
	  return tag
	}}
        renderInput={(params) => {
	  return <TextField
	    {...params}
	    label={props.label}
	  />
	}}
      />
  );
}


const affiliations = {'https://ror.org/054v4yq51' : '/avatars/uol-logo.png'};
