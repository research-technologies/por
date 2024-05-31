import * as React from 'react';
import PropTypes from 'prop-types';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { credit, CreditRole, CreditDescriptions } from 'credit-roles';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";


const grid = 8;
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const PersonItem = styled.div`
`;


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
          <ListItem key={output.title} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={output.title}
              secondary={output.authors.map(function(author,index){ return author.given + " " + author.family +  ", " })}
              title={output.doi}
            />
          </ListItem>
        )}
      </List>

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
