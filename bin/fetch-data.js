const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const filename = 'icaos.json';
const metarsFilename = 'metars.json';

// Load all icaos and fetch metar data for each
loadIcaos()
  .then((icaoInfo) => {
    const chunks = chunk(icaoInfo.map(i => i.icao));
    return fetchMetarData(chunks);
  }).then(metars => {
    fs.writeFileSync(metarsFilename, JSON.stringify(metars));
  });

async function loadIcaos() {
  try {
    var x = fs.readFileSync(filename);
    return JSON.parse(x);
  } catch (e) {
    const icaos = await fetchIcaos();
    return icaos;
  }
}

async function fetchIcaos() {
  // Fetch html-page with icao-codes
  const url = "https://luftfartstilsynet.no/en/forms_organisation/flyplass/landingsplasser/list-of-aerodromes/";
  var response = await axios.get(url);

  // Parse file and create a data structure
  const $ = cheerio.load(response.data);
  const icaos = $('table:first tbody')
    .find('tr')
    .map((_rowIndex, element) => {
      const cells = $(element).find('td');
      return {
        icao: $(cells[0]).text().trim(),
        name: $(cells[1]).text().trim(),
        concessionaire: $(cells[2]).text().trim(),
      }
    }).toArray();

  // Write result to file
  fs.writeFileSync('icaos.json', JSON.stringify(icaos));

  // return structure
  return icaos
}

function chunk(array, chunkSize = 20) {
  return array.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize)

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])
}

async function fetchMetarData(chunks) {
  const metars = [];
  for (const chunk of chunks) {
    const result = await fetchMetar(chunk);
    metars.push(result);
  }

  return metars.flatMap(x => x);
}

async function fetchMetar(icaos) {
  const apiKey = '7ea07a15ec5c5ab9553d15039a';
  const config = {
    headers: {
      'X-API-Key': apiKey,
    }
  };

  const parameter = icaos.join(',');
  const url = `https://api.checkwx.com/metar/${parameter}/decoded`;

  const response = await axios.get(url, config)
  if (response.data.results === 0) {
    console.log('No results');
    document.getElementById('error').style.display = 'block';
    return;
  }
  const metars = response.data.data;

  return metars;
}

