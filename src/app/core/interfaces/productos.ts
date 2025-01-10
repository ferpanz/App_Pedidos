export interface Producto {
  id: number,
  nombre: string,
  precio: number,
  esVegano: boolean,
  esCeliaco: boolean,
  ingredientes: string[],
  fotoUrl: string
}
