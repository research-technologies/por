export const getCrossRefOutputData = (props, value) => {

  // Outputs by people (orcid)
  // https://api.crossref.org/works?filter=orcid:0000-0002-2195-6998,orcid:....

  // Outputs by org (ror) (Needs grants filtered out)
  // https://api.crossref.org/works?filter=ror-id:https://ror.org/04cw6st05&select=DOI,title,type,author

  // Outpus by funder by org (DOI+ROR) (Needs grants filtered out)
  // https://api.crossref.org/funders/10.13039/100010269/works?filter=ror-id:https://ror.org/04cw6st05&select=DOI,title,type


  let orcids = []
  if(props.authPeople?.length){
    orcids = props.authPeople.map((person) => {return person.orcid});
  }

  let rors = []
  if(props.orgs?.length){
    orcids = props.orgs.map((org) => {return org.ror});
  }

  let url = 'https://api.crossref.org/works?filter='
  if(orcids.length) {
    orcids.map(function (orcid) {
      url+=`orcid:"${orcid}",`
    });
  }

  if(rors.length) {
    rors.map(function (ror) {
      url+=`ror-id:"${ror}",`
    });
  }

  url += '&mailto=repositories@ulcc.ac.uk'
  console.log(url);
  return fetch(url)
  .then(response => response.json())
  .then((response) => {
      console.log(response);
      let data = response.message.items?.map(function(output,index){
	   return {title: output.title[0], authors: output.author, publisher: output.publisher, doi: output.DOI, sub: output['short-container-title']};
      });
      console.log(data);
      return data;
  })
}
export const getDataCiteOutputData = (props, value) => {


  // Outputs by Org Datacite
  // https://api.datacite.org/dois?affiliation=true&query=creators.affiliation.affiliationIdentifier:%22https://ror.org/024mrxd33%22

  // Outputs by person Datacite
  // https://api.datacite.org/dois?query=creators.nameIdentifiers.nameIdentifier:%22https://orcid.org/0000-0001-6145-2906%22

  // Outputs by person and ORG DataCITE
  // https://api.datacite.org/dois?query=creators.nameIdentifiers.nameIdentifier:%22https://orcid.org/0000-0001-6145-2906%22%20AND%20creators.affiliation.affiliationIdentifier:%22https://ror.org/024mrxd33%22
  
  // outputs by AWARD number (which we can get from Grants... however almost always circles back to the grant record... so those need filtered out)
  // There are references to projects (but no raids, obvs)
  // Sometimes an actual output
  // https://api.crossref.org/works?filter=award.number:CBET-0756451

}

export const getPeopleData = (props, value, role) => {
  const options = {
        headers: new Headers({'content-type': 'application/json'}),
  };

  //TODO make filters from props orgs, people, etc
  console.log(props.orgs);
  let rors = []
  if(props.orgs.length){
    rors = props.orgs.map((org, key) => {return org.ror});
  }

  // People by output
  // https://pub.orcid.org/v3.0/expanded-search/?q=digital-object-ids:%2210.5518/1116%22
	
  let url = 'https://pub.orcid.org/v3.0/expanded-search/?q='
  if (value){
    url+=`${encodeURI(value)}`
  }

  if(rors.length) {
    url+="+AND+"
    rors.map(function (ror) {
      url+=`ror-org-id:"${ror}"+OR+`
    });
  }
/*
  filters.map(function (filter) {
    Object.keys(filter).map(function (key) {
      url+=`${key}:"${filter[key]}"+OR+`
    });
  });
*/
  url = url.replace(/\+OR\+$/,'');
  // TODO find out if current-institution-affiliation-name actual does anything (it doesn't seem to)
  //url += '&fl=orcid-id,family-name,given-name,current-institution-affiliation-name'
  console.log(url);
  return fetch(url, options)
  .then(response => response.json())
  .then((response) => {
     let data = response['expanded-result'].map(function(person,index){
       return {title: person['given-names']+" "+person['family-names'], orcid: person['orcid-id'], role: role, affiliation: person['institution-name'][0] }
     });
     return data;
  });

}

export const getLogos = () => {
  return { 'https://ror.org/04cw6st05' : '/avatars/uol-logo.png',
      'https://ror.org/01ryk1543' : '/avatars/soton-logo.png',
     'https://ror.org/04fa4r544' : '/avatars/orcid-logo.png' }
}

export const getDataCiteGrantData = (props, value) => {

  let rors = []
  if(props.orgs.length){
    rors = props.orgs.map((org) => {return org.ror});
  }

  let url ="https://api.datacite.org/dois?query=types.resourceType:Grant"

  if(rors.length) {
    url += `%20AND%20(creators.nameIdentifiers.nameIdentifier:"${rors.join(':')}")`
  }
  // value search (for an award number is a bit naff so if we have a ror just use that and let autocomplete find a match by option.title
  /*
  if(value && rors.length == 0){
    url+=`%20AND%20fundingReferences.awardNumber:${encodeURI(value)}`
  }
  */
//    url += '&mailto=repositories@ulcc.ac.uk'

  console.log(url);
  return fetch(url)
  .then(response => response.json())
  .then((response) => {
      console.log(response);
      let data = parse_datacite(response);
      console.log(data);
      return data;
  })

}

export const getCrossRefGrantData = (props, value) => {

  let rors = []
  if(props.orgs.length){
    rors = props.orgs.map((org) => {return org.ror});
  }

  let url ="https://api.crossref.org/works?filter=type:grant"
  if(rors.length) {
    url += `,ror-id:${rors.join(':')}`
  }
  /* value searches on grants seem never return any useful results so we'll just filter based on other data and let autocomplete drag through 
   * the results for string matches against options.title (which is actually project title)
  if(value && rors.length == 0){
    url+=`&query.title=${encodeURI(value)}`
  }
  */
  url += '&mailto=repositories@ulcc.ac.uk'
  console.log(url);
  return fetch(url)
  .then(response => response.json())
  .then((response) => {
      console.log(response);
      let data = parse_crossref(response);
      console.log(data);
      return data;
  })
}

function parse_crossref(response){
      return response.message.items?.map(function(grant,index){
	   return {title: grant.project[0]['project-title'][0]['title'], publisher: grant.publisher, doi: grant.DOI, sub: grant.award};
      });
}
function parse_datacite(response){
      return response.data?.map(function(grant,index){
	   return {title: grant.attributes.titles[0].title, publisher: grant.attributes.publisher, doi: grant.id, sub: grant.attributes.titles[0].title};
      });
}

export const getOrganisationsData = (filters, value, role) => {
  //https://api.ror.org/v2/organizations?filter=types:funder&filter=country.country_code:gb
  console.log("ORG FILTERS: ",filters);


  let url ='https://api.ror.org/v2/organizations?'
  filters.map(function (filter) {
    Object.keys(filter).map(function (key) {
      url+=`filter=${key}:${filter[key]}&`
    });
  });
  if (value){
    url+=`query.advanced=names.value:${encodeURI(value)}`
  }
  console.log(url)
  return fetch(url)
  .then(response => response.json())
  .then((response) => {
      let data = response.items.map(function(org,index){
	   return {title: org.names.filter(function(name){return name.lang === 'en' && !name.types.includes('alias')})[0]?.value,
		   ror: org.id, 
		   types: org.types,
		   role: role};
      });
      //console.log(data);
      return data;
  })
}

