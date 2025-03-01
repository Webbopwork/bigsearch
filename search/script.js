//const jsonFile = require("./motors.json");
link_template = document.getElementById("link");

link_container = document.getElementById("link-container");

link_container_results = document.getElementById("link-container-results");

search_bar = document.getElementById("searchbar");

exclusion_bar = document.getElementById("exclusions");

inclusion_bar = document.getElementById("inclusions");

//search_button = document.getElementById("search-button");

validity_check = document.getElementById("validity");

_title = document.getElementsByTagName("title")[0];

console.log(_title);

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has("q")) {
  const search_query = urlParams.get("q");
  console.log(search_query);
  if (search_query != '' && search_query != ' ') {
    console.log("Yeee");
    search_bar.value = search_query;
    search_click();
  } else {
    no_query();
  }
} else {
  no_query();
}

function no_query() {
  location.replace('../');
  throw new Error("Need to have a search query");
}

var use_exclusions = false;

var exclusions = [];

if (urlParams.has("excl")) {
  exclusions = urlParams.get('excl');
  exclusion_bar.value = exclusions;
  if (exclusions != '') {
    use_exclusions = true;
    exclusions = exclusions.toLowerCase().split(", ");
    console.log(exclusions);
  }
}

var use_inclusions = false;

var inclusions = [];

if (urlParams.has("incl")) {
  inclusions = urlParams.get('incl');
  inclusion_bar.value = inclusions;
  if (inclusions) {
    use_inclusions = true;
    inclusions = inclusions.toLowerCase().split(", ");
    console.log(inclusions);
  }
}

if (urlParams.has("bg")) {
  const background = urlParams.get('bg');
  if (background=="space") {
    document.getElementById("space-toggle").checked = true;
  } else if (background=="random") {
    document.getElementById("random-toggle").checked = true;
  }
  //source.unsplash.com/random/1920x1080/?=term
}

/*fetch("https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=Belgium&limit=5").then(function(resp) {
    console.log(resp);
    return resp.json()
}).then(function(data) {
    console.log(data);
});*/

/*console.log(navigator.userAgent);

let headers = new Headers({
    "Accept"       : "text/html",
    "Content-Type" : "text/html",
    "User-Agent"   : navigator.userAgent,//"MY-UA-STRING"
    "x-content-type-options": "nosniff"
});

fetch("https://www.google.com/", {
  method: 'GET',
  headers: headers,
  mode: 'no-cors'
})//"https://7a8741f1-7e0f-4663-9e79-7baae2ad6d54-00-17syuw9nh3g45.spock.replit.dev/")
  .then((response) => {
    return response.blob();
  })
  .then((blob) => {//console.log(text)
    link_container.innerHTML = blob;
    return blob;
  });
  /*.then((response) => {
    console.log(response);
    console.log(response.blob());
    link_container.innerHTML = response.text();
    console.log(response.text());
  });*/

// Execute a function when the user presses a key on the keyboard
/*search_bar.addEventListener("keyup", function(event) {
  console.log(event.keyCode);
  // If the user presses the "Enter" key on the keyboard
  if (event.keycode == 13) {
    //console.log(search_bar.value);
    console.log("It works!!!!!");
    // Cancel the default action, if needed
    //event.preventDefault();
    //search_click();
  }
});*/

function file_safe(string) {
  return string.replace(/[/\\?%*:|"<>]/g, '');
}

function cache_search(term, title, url, snippet, source) {
  //saveto("/search/cached-results/"+source+"/"+file_safe(term))
}

function passthrough(anything) {
  console.log("passthrough used for", anything);
  return anything;
}

function plus_process_term(term) {
  return term.replace(/ /g, "+");
}

function _20_process_term(term) {
  return term.replace(/ /g, "%20");
}

function underscore_process_term(term) {
  return term.replace(/ /g, "_");
}

function dash_process_term(term) {
  return term.replace(/ /g, "-");
}

function decide_process_term(term_processing) {
  if (term_processing == "plus_process_term") {
    return plus_process_term;
  } else if (term_processing == "_20_process_term") {
    return _20_process_term;
  } else if (term_processing == "underscore_process_term") {
    return underscore_process_term;
  } else if (term_processing == "dash_process_term") {
    return dash_process_term;
  } /*else {
    return passthrough;
  }*/
}

function process_term(term, term_processing) {
  return decide_process_term(term_processing)(term);
}

function construct_url_bits(before, after, term, term_processing) {
  return before + process_term(term, term_processing) + after;
}

function construct_url(_motor) {
  return construct_url_bits(_motor.before, _motor.after, _motor.term, _motor.term_processing);
}

function data_process_set_term(data, term) {
  for (const motor in data) {
    data[motor].term = term;
    //console.log(motor);
    data_process_induvidual(data[motor]);
    console.log('"',motor, '" loaded');
  }
}

function data_process(data) {
  /*if (use_exclusions) {
    const checker = value =>
      !exceptions.some(element => value["url"].includes(element));
    //console.log(checker(name));
    //console.log(.filter(checker));
    //!exclusions
  }
  else {
    console.log("No exclusions");
  }

  //console.log(data.filter(checker));*/
  
  for (let motor in data.filter(checker)) {
    if (use_exclusions && motor in exceptions) {
      console.log("Skipping", motor);
      continue;
    }
    data_process_induvidual(motor);
  }
}

function data_process_induvidual(data) {
  if (use_inclusions) {
    if (check_inclusion_status(data)) {
      add_link(data.name, construct_url(data));
    }
  } else if (use_exclusions) {
    /*const checker = value =>
      !['banana', 'apple'].some(element => value.includes(element));
    console.log(checker);
    console.log(data.includes);*/
    //[data.before, data.name.to_lowercase(), data.after]
    if (!check_exclusion_status(data)) {
      add_link(data.name, construct_url(data));
    }
  } else {
    add_link(data.name, construct_url(data));
  }
}

function check_inclusion_status(data) {
  return inclusions.some(inclusion => check_for_exclusion(data, inclusion));
}

function check_exclusion_status(data) {
  return exclusions.some(exclusion => check_for_exclusion(data, exclusion));
}

function check_for_exclusion(data, exclusion) {
  return (data.name.toLowerCase().includes(exclusion) || data.before.includes(exclusion) || data.after.includes(exclusion));
}

function data_process_induvidual_set_term(data) {
  data.term = term;
  add_link(data.name, construct_url(data));
}

function search(term) {
  fetch('../motors.json')
    .then((response) => response.json())
    .then((json) => data_process_set_term(json, term));
}

function search_click() {
  if (search_bar.value != "") {
    validity.title = "You have a term and can search.";
    search_bar.style.border = "none;";
    _title.innerHTML = '"' + search_bar.value + '" on BigSearch'
    search(search_bar.value);
    //const lowecase_term = search_bar.value.toLowerCase();
    //exclusions.some(exclusion => lowercase_term.includes(exclusion));
    if (search_bar.value.toLowerCase().includes('sound')){
      let text = search_bar.value.toLowerCase();
      if (text.includes('techy')) fetch("https://techy-api.vercel.app/api/text")
      .then((resp) => resp.text())
      .then((data) => {
        console.log(data);
        /*for (let i = 0; i < data.meanings.length; i++) {
          add_link_result_info(data[1][i], data[3][i]);
        };*/
        // change later to be info tile
        add_link_result_info('ðŸ¤“', 'https://cdn-0001.qstv.on.epicgames.com/mMUEVMTTpGINzVEohr/image/screen_comp.jpeg', data);
      });
      else if (text.includes('corprate') || text.includes('boss') || text.includes('company')) fetch("https://corporatebs-generator.sameerkumar.website/")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        /*for (let i = 0; i < data.meanings.length; i++) {
          add_link_result_info(data[1][i], data[3][i]);
        };*/
        // change later to be info tile
        add_link_result_info('ðŸ•´', 'https://www.greatplacetowork.ca/images/blog-new/employee-satisfaction.webp', data.phrase);
      });
    }
    /*if ( ( (text) => (text.startsWith('meaning') || text.endsWith('meaning')) )(search_bar.value.toLowerCase()) ) fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/<word>${search_bar.value}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        for (let i = 0; i < data.meanings.length; i++) {
          add_link_result_info(data[1][i], data[3][i]);
        };
        // change later to be info tile
        //add_link_result(data[1][i], data[3][i]);
    });*/
    if ( !(use_inclusions || use_exclusions) || (use_inclusions && inclusion.some(inclusion => "wikipedia".includes(inclusion))) || (!use_inclusions && use_exclusions && !exclusions.some(exclusion => "wikipedia".includes(exclusion))) ) fetch(`https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${search_bar.value}&limit=10`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        for (let i = 0; i < data[1].length; i++) {
          add_link_result(data[1][i], data[3][i]);
        };
    });
  }
  else {
    validity.title = "You need to write a term to search for.";
    search_bar.style.border = "2px solid red;";
    alert("You need to write a search term!");
  }
}

function add_link(name, url) {
  let clone = link_template.content.cloneNode(true);
  let inner_container = clone.firstElementChild;
  let a = inner_container.firstElementChild;
  let _url = inner_container.lastElementChild.firstElementChild;
  //console.log(clone);
  a.textContent = name;
  _url.textContent = url;
  a.href = url;
  _url.href = url; 
  _url.title = url;
  _url.alt = url;
  link_container.appendChild(clone);
}

function add_link_result(name, url) {
  let clone = link_template.content.cloneNode(true);
  let inner_container = clone.firstElementChild;
  let a = inner_container.firstElementChild;
  let _url = inner_container.lastElementChild.firstElementChild;
  //console.log(clone);
  a.textContent = name;
  _url.textContent = url;
  a.href = url;
  _url.href = url; 
  _url.title = url;
  _url.alt = url;
  link_container_results.appendChild(clone);
}

function add_link_result_info(name, url, info) {
  let clone = link_template.content.cloneNode(true);
  let inner_container = clone.firstElementChild;
  let a = inner_container.firstElementChild;
  let _url = inner_container.lastElementChild.firstElementChild;
  //console.log(clone);
  a.textContent = name;
  _url.textContent = info;
  a.href = url;
  _url.href = url; 
  _url.title = info;
  _url.alt = info;
  link_container_results.appendChild(clone);
}

_headers = new Headers({
  "Access-Control-Allow-Origin" : "*",
});

//https://www.google.com/robots.txt
//a div with id="search" only exists when found
function get_webpage(url) {
  fetch(url, {
    mode: 'cors',
    headers: _headers,
  })
    .then((response) => {
      console.log(response);
      console.log(response.headers);
      return response.text();
    })
    .then((text) => {
      console.log(text);
      return text;
    });
}

//get_webpage('https://www.wikipedia.org/');
