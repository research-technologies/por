import * as React from 'react';
import PropTypes from 'prop-types';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { credit, CreditRole, CreditDescriptions } from 'credit-roles';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";

import { getLogos } from '../api';


const grid = 8;
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const PersonItem = styled.div`
`;

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));



function Person({ person, index }) {
  return (
    <Draggable draggableId={person.orcid} index={index}>
      {provided => (
        <PersonItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
    <ListItem key={person.title} sx={{ py: 1, px: 0 }}>
      <ListItemText
        sx={{ mr: 2 }}
        primary={person.title}
        secondary={<React.Fragment>{person.orcid}<br/>{person.affiliation}</React.Fragment>}
        title={CreditRole[person.role]}
       />
    </ListItem>
        </PersonItem>
      )}
    </Draggable>
  );
}

const PersonList = React.memo(function PersonList({ persons }) {
  console.log(persons);
  return persons.map((person, index) => (
    <Person person={person} index={index} key={person.orcid} />
  ));
});

function Info(props) {

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const [output, setOutput] = React.useState({});

  const handleClickOpen = (output) => () => {
    setOpen(true);
    setScroll('paper');
    setOutput(output)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);


  const [state, setState] = React.useState({persons: []});


  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    console.log(result);
    if (result.destination.index === result.source.index) {
      return;
    }

    const persons = reorder(
      props.authPeople,
      result.source.index,
      result.destination.index
    );
    props.onAuthPeopleChange(persons); 

  }

  function ScrollDialog(props) {

    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('md');

    const authors = output.authors;
    const accepted_date = output.full?.accepted['date-parts'][0][0] + "-" +output.full?.accepted['date-parts'][0][1] + "-" + output.full?.accepted['date-parts'][0][2];
    console.log("ACCETPED DATE : ",accepted_date);
    return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Review bibliographic information</DialogTitle>
        <DialogContent>
<br/>
          <FormGrid item xs={12}>
            <TextField
              id="title"
              name="title"
              type="title"
              label="Title"
              value={output.title}
             required
           />
        </FormGrid>

        <br/>
      <FormGrid item xs={12}>
        <Autocomplete
          clearIcon={false}
          options={[]}
          freeSolo
          multiple
          required
          defaultValue={authors}
          renderTags={(authors, props) =>
            authors.map(function(author, index) {
              let avatar = <Avatar 
		         alt={author.given + " " + author.family} 
		         src={author.ORCID ? getLogos()['https://ror.org/04fa4r544'] : author }
		        />

               return (<Chip label={author.given + " " +author.family} {...props({ index })} avatar={avatar} />)
	    })
          }
          renderInput={(params) => <TextField label="Authors" {...params} />}
          />
      </FormGrid>
      <br/>
      <FormGrid item xs={12}>
        <TextField
          id="abstract"
          name="abstract"
          type="abstract"
          label="Abstract"
          multiline
          maxRows={5}
          defaultValue={output.full?.abstract || null}
        />
      </FormGrid>

      <br/>

        <InputLabel id="demo-simple-select-label">Dates</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={"accepted"}
          label="Event"
        >
          <MenuItem value={"accepted"}>Accepted</MenuItem>
          <MenuItem value={"published"}>Published</MenuItem>
          <MenuItem value={"published_online"}>Published Online</MenuItem>
          <MenuItem value={"submitted"}>Submitted</MenuItem>
          <MenuItem value={"completed"}>Completed</MenuItem>
          <MenuItem value={"award"}>Awarded</MenuItem>
        </Select>
        <OutlinedInput
          id="date"
          name="date"
          type="date"
          defaultValue={accepted_date}
          placeholder={accepted_date}
        />
      <br/>
      <br/>
      <FormGrid item xs={12}>
        <TextField
          id="Publisher"
          name="publisher"
          type="text"
          label="Publisher"
          defaultValue={output.publisher}
        />
      </FormGrid>
      <br/>
      <FormGrid item xs={12}>
        <TextField
          id="ISSN"
          name="issn"
          type="text"
          label="ISSN"
          defaultValue={output.full ? output.full['issn-type'][0].value : ""}
        />
      </FormGrid>
      <br/>
      <FormGrid item xs={12}>
        <TextField
          id="journal"
          name="journal"
          type="text"
          label="Journal"
          defaultValue={output.full ? output.full['container-title'][0] : ""}
        />
      </FormGrid>

      <br/>
      <InputLabel htmlFor="issn">Funding information</InputLabel>
       <br/>

      {output.full?.funder.map((f,index) =>
        <React.Fragment>
          <FormGrid item xs={12}>
            <div style={{ display: 'inline-flex' }}> 
              <TextField fullWidth spacing={3}
               id={"funder_name"+index}
               name="funder_name"
               type="text"
               label="Funders Name"
               defaultValue={f.name}
              />
              &nbsp;
              <TextField
               id={"funder_doi"+index}
               name="funder_doi"
               type="text"
	       label="DOI"
               defaultValue={f.DOI}
              />
              &nbsp;
              <TextField
               id={"award"+index}
               name="award"
               type="text"
	       label="Award"
               defaultValue={f.award[0]}
              />
	    </div>
          </FormGrid> 
	  <br/>
       </React.Fragment>
      )}

      {output.full?.license.map((l,index) =>
        <React.Fragment>
          <FormGrid item xs={12}>
            <div style={{ display: 'inline-flex' }}> 
              <TextField fullWidth spacing={3}
               id={"license_url"+index}
               name="license_url"
               type="text"
               label="License URL"
               defaultValue={l.URL}
              />
              &nbsp;
              <TextField
               id={"license_version"+index}
               name="license_version"
               type="text"
	       label="Version"
               defaultValue={l['content-version']}
              />
              &nbsp;
              <TextField
               id={"start"+index}
               name="start"
               type="text"
	       label="Start date"
               defaultValue={l.start ? l.start['date-parts'][0][0]+"-"+l.start['date-parts'][0][1]+"-"+l.start['date-parts'][0][2] : ""}
              />
	    </div>
          </FormGrid> 
	  <br/>
       </React.Fragment>
      )}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Merge</Button>
          <Button onClick={handleClose}>Create</Button>
          <Button onClick={handleClose}>Discard</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
    );

    return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
        <DialogContent dividers={true}>



        </DialogContent>
      </Dialog>
    </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Organisations
      </Typography>
      <List disablePadding>
       {props.partOrgs.map((org,index) => 
          <ListItem key={org.title} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={org.title}
              secondary={org.types.join(', ')}
              title={org.ror}
            />
          </ListItem>
        )}
      </List>
      <List disablePadding>
       {props.fundOrgs.map((org,index) => 
          <ListItem key={org.title} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={org.title}
              secondary={org.types.join(', ')}
              title={org.ror}
            />
          </ListItem>
        )}
      </List>

      <Typography variant="h5" gutterBottom>
        Grants
      </Typography>
      <List disablePadding>
       {props.grants.map((grant,index) => 
          <ListItem key={grant.title} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={grant.title}
              secondary={grant.publisher+"/"+grant.sub}
              title={grant.doi}
            />
          </ListItem>
        )}
      </List>

      <Typography variant="h5" gutterBottom>
        Projects
      </Typography>

      <Typography variant="h5" gutterBottom>
        People
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <List disablePadding>
                {provided.placeholder}
                <PersonList persons={props.authPeople} />
              </List>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Typography variant="h5" gutterBottom>
        Outputs
      </Typography>
      <List disablePadding>
       {props.outputs.map((output,index) => 
          <ListItem key={output.title} sx={{ py: 1, px: 0 }} onClick={handleClickOpen(output)}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={output.title}
              secondary={output.authors.map(function(author,index){ return author.given + " " + author.family +  ", " })}
              title={output.doi}
            />
          </ListItem>
        )}
      </List>
     <ScrollDialog />
    </React.Fragment>
  );
}

{/*
       {props.authPeople.map((person,index) => 
          <Person person={person} index={index} key={person.orcid} />
        )}
*/}

	       {/*
	       <ListItem key={person.title} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={person.title}
              secondary={<React.Fragment>{person.orcid}<br/>{person.affiliation}</React.Fragment>}
              title={CreditRole[person.role]}
            />
          </ListItem>
	  */}

export default Info;


