export interface ProductChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

export interface IData {
  id: string;
  categoryIcon: string;
  nameBn: string;
  today: number;
  change: ProductChange;
  image:string,
  unit:string
}
