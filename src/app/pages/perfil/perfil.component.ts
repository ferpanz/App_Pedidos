import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Perfil } from 'src/app/core/interfaces/perfil';
import { HeaderService } from 'src/app/core/services/header.service';
import { PerfilService } from 'src/app/core/services/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PerfilComponent {
  headerService = inject(HeaderService);
  router = inject(Router);
  perfilService = inject(PerfilService);

  ngOnInit(): void {
    this.headerService.titulo.set("Perfil");
    if(this.perfilService.perfil()){
      this.perfil = {...this.perfilService.perfil()!}
    }
  }

  perfil:Perfil = {
    nombre: "",
    direccion: "",
    telefono: "",
    detalleEntrega: ""
  }

  guardarDatosPerfil(){
    this.perfilService.guardarDatos(this.perfil);
    this.router.navigate(["/carrito"]);
  }

}
