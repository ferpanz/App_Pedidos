import { Injectable, WritableSignal, signal } from '@angular/core';
import { Perfil } from '../interfaces/perfil';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor() {
    const perfilLS = localStorage.getItem('perfil');
    if(perfilLS) this.perfil.set(JSON.parse(perfilLS));
   }

  perfil:WritableSignal<Perfil | undefined> = signal(undefined);

  guardarDatos(perfil:Perfil){
    localStorage.setItem('perfil',JSON.stringify(perfil));
    this.perfil.set(perfil);
  }

}
