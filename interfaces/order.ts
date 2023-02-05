export type OrderBy = 'icao' | 'wind' | 'temp';
export type Direction = 'asc' | 'desc';

export interface Order {
  orderBy: OrderBy;
  direction: Direction;
}
