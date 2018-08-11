import { Component, OnInit } from '@angular/core';
import { Foto } from '../foto/foto.model';
import { FotoService } from '../foto/foto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MensagemComponent } from '../mensagem/mensagem.component';
import { Mensagem } from '../mensagem/mensagem';

@Component({
  selector: 'caelumpic-cadastrado',
  templateUrl: './cadastrado.component.html',
  styles: []
})
export class CadastradoComponent implements OnInit {

  foto = new Foto();
  mensagem= new Mensagem();

  constructor(private servico: FotoService, private rotaAtivada:ActivatedRoute, private roteador: Router){}

  ngOnInit() { 
    console.log(this.rotaAtivada);

    //this.rotaAtivada.params.subscribe(parametros => console.log(parametros.fotoId))
    
    let fotoId = this.rotaAtivada.snapshot.params.fotoId

    if(fotoId){
      this.servico.pesquisar(fotoId).subscribe(fotoApi => this.foto = fotoApi)
    }
   }

  salvar(){
    if(this.foto._id){
      this.servico.atualizar(this.foto).subscribe(
                                       () => {
                                              console.log(`${this.foto.titulo} Atualizado com Sucesso!`)
                                              this.mensagem.texto = `${this.foto.titulo} Atualizado com Sucesso!`
                                              this.mensagem.tipo = 'success'
                                              setTimeout(
                                                () => this.roteador.navigate([''])
                                                ,2000
                                              )
                                              
                                             }
                                        ,() => {this.mensagem.texto = `Erro ao Cadastrar!`, 
                                                this.mensagem.tipo = 'danger'}
                                            )

    }
    else{
      this.servico
          .cadastrar(this.foto)
          .subscribe(
            (resposta) => {
              console.log('Salvou',resposta,MensagemComponent)
              this.mensagem.texto = `${this.foto.titulo} Cadastrado com Sucesso!`
              this.mensagem.tipo = 'success'
              this.foto = new Foto()
            }
            ,() => {this.mensagem.texto = `Erro ao Cadastrar!`, this.mensagem.tipo = 'danger'}
          )
    }
  }
}
