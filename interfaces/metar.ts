export interface Metar {
  barometer: {
    hg: number;
    hpa: number;
    kpa: number;
    mb: number;
  },
  ceiling?: Cloud;
  clouds: Cloud[];
  conditions?: Condition[];
  dewpoint: Temperature;
  elevation: {
    feet: number;
    meters: number;
  },
  flight_category: string;
  humidity: {
    percent: number;
  },
  icao: string;
  observed: Date;
  raw_text: string;
  station: Station;
  temperature: Temperature;
  visibility: Visibility;
  wind: Wind;
  windChill?: Temperature;
}

type GeometryType = 'Point';
type StationType = 'Airport';

interface Condition {
  code: string;
  prefix: string;
  text: string;
}

interface Wind {
  degrees: number,
  speed_kph: number,
  speed_kts: number,
  speed_mph: number,
  speed_mps: number
}

interface Visibility {
  meters: string;
  meters_float: number;
  miles: string;
  miles_float: number;
}

interface Temperature {
  celsius: number;
  fahrenheit: number;
}

interface Station {
  geometry: {
    coordinates: [number, number]
    type: GeometryType;
  },
  location: string;
  name: string;
  type: StationType;
}

interface Cloud {
  base_feet_agl: number,
  base_meters_agl: number,
  code: string,
  feet: number,
  meters: number,
  text: string,
}
