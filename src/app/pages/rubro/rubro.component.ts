import { CommonModule } from '@angular/common';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TarjetaArticuloComponent } from 'src/app/core/components/tarjeta-articulo/tarjeta-producto.component';
import { Producto } from 'src/app/core/interfaces/productos';
import { CategoriasService } from 'src/app/core/services/categorias.service';
import { HeaderService } from 'src/app/core/services/header.service';

@Component({
  selector: 'app-rubro',
  templateUrl: './rubro.component.html',
  styleUrls: ['./rubro.component.scss'],
  standalone: true,
  imports: [TarjetaArticuloComponent, CommonModule, RouterModule]
})
export class RubroComponent {
  headerService = inject(HeaderService);
  categoriasService = inject(CategoriasService);
  ac = inject(ActivatedRoute);
  productos:WritableSignal<Producto[]> = signal([])


  ngOnInit(): void {
    this.ac.params.subscribe(params => {
      if(params['id']){
        this.categoriasService.getById(parseInt(params['id']))
        .then(categoria =>{
          if(categoria) {
            this.productos.set(categoria.productos);
            this.headerService.titulo.set(categoria.nombre);
          }})
      }
    })
    //
  }
}
