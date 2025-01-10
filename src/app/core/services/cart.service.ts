import { Injectable } from '@angular/core';
import { Cart } from '../interfaces/carrito';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private config:ConfigService) {
    const cart = localStorage.getItem("cart");
    if(cart) {
      const carritoGuardado = JSON.parse(cart);
      if(carritoGuardado){
        const fechaGuardado = new Date(carritoGuardado.fecha);
        const fecha = new Date();
        if(fecha.getTime() - fechaGuardado.getTime() > 1000*60*60*24*this.config.configuracion().diasVencimientoCarrito){
          this.vaciar();
        } else {
          this.carrito = carritoGuardado.productos;
        }
      }
    }
   }

  carrito: Cart[] = []

  agregarProducto(idProducto:number, cantidad: number, notas:string){
    const i = this.carrito.findIndex(producto => producto.idProducto === idProducto);
    if(i === -1){
      const nuevoProducto:Cart = {idProducto:idProducto, cantidad:cantidad ,notas:notas};
      this.carrito.push(nuevoProducto);
    } else {
      this.carrito[i].cantidad += cantidad;
    }
    this.actualizarAlmacenamiento();
  }

  eliminarProducto(idProducto:number){
    this.carrito = this.carrito.filter(producto => producto.idProducto !== idProducto);
    if(this.carrito.length === 0) return localStorage.removeItem("cart");
    this.actualizarAlmacenamiento();
  }

  cambiarCantidadProducto(idProducto:number, cantidad: number){
    this.carrito = this.carrito.map(producto => {
      const productoActual = producto;
      if(productoActual.idProducto === idProducto) productoActual.cantidad = cantidad;
      return productoActual;
    })
    this.actualizarAlmacenamiento();
  }

  actualizarAlmacenamiento(){
    const fecha = new Date();
    const elementoAGuardar = {
      fecha,
      productos:this.carrito
    }
    localStorage.setItem("cart",JSON.stringify(elementoAGuardar));
  }

  vaciar(){
    this.carrito = [];
    localStorage.removeItem("cart");
  }

}
