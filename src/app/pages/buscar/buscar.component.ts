import { CommonModule } from '@angular/common';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Busqueda } from 'src/app/core/interfaces/busqueda';
import { HeaderService } from 'src/app/core/services/header.service';
import { ProductosService } from 'src/app/core/services/productos.service';
import { TarjetaArticuloComponent } from "../../core/components/tarjeta-articulo/tarjeta-producto.component";
import { Producto } from 'src/app/core/interfaces/productos';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-buscar',
    templateUrl: './buscar.component.html',
    styleUrls: ['./buscar.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, TarjetaArticuloComponent,RouterModule]
})
export class BuscarComponent {
  headerService = inject(HeaderService);
  productosService = inject(ProductosService);
  productos:WritableSignal<Producto[]> = signal([])

  ngOnInit(): void {
    this.headerService.titulo.set("Buscar");
    this.productosService.getAll().then(res => this.productos.set(res));
  }

  parametrosBusqueda:Busqueda = {
    texto: "",
    aptoCeliaco: false,
    aptoVegano: false,
  }

  async buscar(){
    this.productos.set(await this.productosService.buscar(this.parametrosBusqueda));
  }

}
