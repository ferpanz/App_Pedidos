import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { HeaderService } from 'src/app/core/services/header.service';
import { ContadorCantidadComponent } from "../../core/components/contador-cantidad/contador-cantidad.component";
import { Producto } from 'src/app/core/interfaces/productos';
import { ProductosService } from 'src/app/core/services/productos.service';
import { Router, RouterModule } from '@angular/router';
import { PerfilService } from 'src/app/core/services/perfil.service';
import { NUMERO_WHATSAPP } from 'src/app/core/constantes/telefono';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.scss'],
    standalone: true,
    imports: [CommonModule, ContadorCantidadComponent, RouterModule]
})
export class CarritoComponent {
  headerService = inject(HeaderService);
  cartService = inject(CartService);
  productosService = inject(ProductosService);
  perfilService = inject(PerfilService);
  configService = inject(ConfigService);
  router = inject(Router);

  productosCarrito:WritableSignal<Producto[]>= signal([]);

  subtotal = 0;
  total = 0;
  @ViewChild("dialog") dialog!: ElementRef<HTMLDialogElement>;


  ngOnInit(): void {
    this.headerService.titulo.set("Carrito");
    this.buscarInformacionProductos().then(() =>{
      this.calcularInformacion();
    })
  }

  async buscarInformacionProductos(){
    for (let i = 0; i < this.cartService.carrito.length; i++) {
      const itemCarrito = this.cartService.carrito[i];
      const res = await this.productosService.getById(itemCarrito.idProducto)
      if(res) this.productosCarrito.set([...this.productosCarrito(),res]);
    }
  }

  eliminarProducto(idProducto:number){
    this.cartService.eliminarProducto(idProducto);
  }

  calcularInformacion (){
    this.subtotal = 0;
    for (let i = 0; i < this.cartService.carrito.length; i++) {
      this.subtotal += this.productosCarrito()[i].precio * this.cartService.carrito[i].cantidad;
    }
    this.total = this.subtotal + this.configService.configuracion().costoEnvio;
  }

  cambiarCantidadProducto(id:number,cantidad:number){
    this.cartService.cambiarCantidadProducto(id,cantidad)
    this.calcularInformacion();
  }

  async enviarMensaje(){
    let pedido = "";
    for (let i = 0; i < this.cartService.carrito.length; i++) {
        const producto = await this.productosService.getById(this.cartService.carrito[i].idProducto);
        const notas = this.cartService.carrito[i].notas ? ` (Notas: ${this.cartService.carrito[i].notas})` : "";
        pedido += `*${this.cartService.carrito[i].cantidad} x ${producto?.nombre}* ${notas}\n
`
    }
    let mensaje = `
¡Hola!
Soy *${this.perfilService.perfil()?.nombre}*, y te quiero hacer el siguiente pedido:

${pedido}

El monto total a abonar es:

*$${this.total}*

`;

  if (this.tipoEntrega === 'domicilio') {
    mensaje += `
La dirección de envío es:

*${this.perfilService.perfil()?.direccion}* - ${this.perfilService.perfil()?.detalleEntrega}.
`;
  } else {
    mensaje += `*Este pedido será retirado en el local.*

    `;
  }

  mensaje += `\n*¡Muchas gracias!*`;


    const link = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURI(mensaje)}`
    window.open(link,"_blank");
    this.dialog.nativeElement.showModal()
  }

  finalizarPedido(){
    this.cartService.vaciar();
    this.dialog.nativeElement.close();
    this.router.navigate(['/']);
  }

  editarPedido(){
    this.dialog.nativeElement.close();
  }

  tipoEntrega: 'local' | 'domicilio' = 'local'; // Valor inicial predeterminado

  actualizarTipoEntrega(tipo: 'local' | 'domicilio') {
    this.tipoEntrega = tipo;
    if (tipo === 'local') {
      this.total = this.subtotal; // Elimina el costo de envío si se retira en el local
    } else {
      this.total = this.subtotal + this.configService.configuracion().costoEnvio;
    }
  }
}

