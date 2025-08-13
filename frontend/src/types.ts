export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  name: string;
  description: string;
  date: string;  
  products?: Product[];
}
