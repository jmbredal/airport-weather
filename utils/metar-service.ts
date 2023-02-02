import { Result } from '../interfaces/result';
import { Metar } from './../interfaces/metar';
import { airports } from './airport-service';

const axios = require('axios').default;

const timeoflastupdateKey = 'timeoflastupdate';
const metarsKey = 'metars';
const thirtyMinutes = 30 * 60 * 1000;

type Icao = string;

// Fetch all airports and fetch metar data for each
export async function getMetars(): Promise<Result<Metar[]>> {
  console.log('getMetars');

  // Get time of last fetch from localstorage
  const timeoflastUpdateRaw = localStorage.getItem(timeoflastupdateKey);
  const timeoflastUpdate = timeoflastUpdateRaw && new Date(+timeoflastUpdateRaw).getTime();
  const now = new Date().getTime();
  const shouldFetch = timeoflastUpdate && now - timeoflastUpdate > thirtyMinutes;

  if (shouldFetch || timeoflastUpdate == null) {
    console.log('Fetching from checkwx');
    
    // If time of last fetch is more then 30 minutes,
    // or we do not have data in localstorage
    // fetch from checkwx
    const icaos = airports.map(a => a.icao);
    try {
      const metars = await fetchMetarData(chunk(icaos));
      localStorage.setItem(metarsKey, JSON.stringify(metars));
      localStorage.setItem(timeoflastupdateKey, JSON.stringify(now));
  
      return { ok: true, value: metars };
    } catch (error: any) {
      return { ok: false, value: new Error(error.name) };
    }
  } else {
    console.log('Fetching from localstorage');
    
    // If time of last fetch is less then 30 minutes, use localStorage
    const value: Metar[] = JSON.parse(localStorage.getItem(metarsKey)!);
    return { ok: true, value };
  }

}

// Fetch all metar data
// Divided into chunks because of max number of icaos per request
async function fetchMetarData(chunks: Icao[][]): Promise<Metar[]> {
  const metars = [];
  for (const chunk of chunks) {
    const result = await fetchMetar(chunk);
    metars.push(result);
  }

  return metars.flatMap(x => x);
}

// Fetch all metars for this list of icaos
// NB: max number of icaos in one single request is 20
// <https://www.checkwxapi.com/documentation/metar>
async function fetchMetar(icaos: Icao[]): Promise<Metar[]> {
  const apiKey = '7ea07a15ec5c5ab9553d15039a';
  const config = {
    headers: {
      'X-API-Key': apiKey,
    }
  };

  const parameter = icaos.join(',');
  const url = `https://api.checkwx.com/metar/${parameter}/decoded`;

  const response = await axios.get(url, config)
  const metars = response.data.data;

  return metars;
}

// Chunk a list into chunks:
// [1, 2, 3, 4] => [[1, 2], [3, 4]]  chunkSize=2
function chunk(array: string[], chunkSize = 20): string[][] {
  const chunks = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }

  return chunks;
}
