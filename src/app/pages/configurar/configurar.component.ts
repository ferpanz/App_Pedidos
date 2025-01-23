import { Component, OnInit, inject } from '@angular/core';
import { HeaderService } from './../../core/services/header.service';
import { ProductosService } from 'src/app/core/services/productos.service';
import { Producto } from 'src/app/core/interfaces/productos';

@Component({
  selector: 'app-configurar',
  templateUrl: './configurar.component.html',
  styleUrls: ['./configurar.component.scss'],
})
export class ConfigurarComponent implements OnInit {
  headerService = inject(HeaderService); // Inyección del HeaderService
  productos: Producto[] = []; // Aquí se guardarán los productos cargados

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.headerService.titulo.set('Configurar'); // Cambiar el título
    this.cargarProductos(); // Cargar productos al inicializar el componente
  }

  async cargarProductos(): Promise<void> {
    try {
      this.productos = await this.productosService.getAll(); // Llamada al servicio para cargar los productos
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }

  actualizarPrecio(producto: Producto): void {
    console.log('Precio actualizado para ${producto.nombre}: ${producto.precio}');
    // Aquí puedes agregar lógica adicional si decides integrar un backend.
  }
}
