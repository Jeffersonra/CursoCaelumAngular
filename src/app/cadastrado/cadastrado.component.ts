import { Component, OnInit } from '@angular/core';
import { Foto } from '../foto/foto.model';
import { FotoService } from '../foto/foto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MensagemComponent } from '../mensagem/mensagem.component';
import { Mensagem } from '../mensagem/mensagem';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'caelumpic-cadastrado',
  templateUrl: './cadastrado.component.html',
  styles: []
})
export class CadastradoComponent implements OnInit {

  foto = new Foto();
  mensagem= new Mensagem();

  formCadastro:FormGroup;

  constructor(private servico: FotoService
            ,private rotaAtivada:ActivatedRoute
            ,private roteador: Router
            ,private formBuilder:FormBuilder){}

  ngOnInit() { 

    this.formCadastro = this.formBuilder.group({
      titulo:['', Validators.compose([
        Validators.required,
        Validators.minLength(5)
        ])],
      url: ['', Validators.required],
      descricao:''
    })

    console.log(this.rotaAtivada);

    //this.rotaAtivada.params.subscribe(parametros => console.log(parametros.fotoId))
    
    let fotoId = this.rotaAtivada.snapshot.params.fotoId

    if(fotoId){
      this.servico.pesquisar(fotoId)
                  .subscribe(fotoApi =>{
                                        this.foto = fotoApi
                                        this.formCadastro.patchValue(fotoApi)
      })
    }
   }

   get titulo(){
     return this.formCadastro.get('titulo');
   }

   get url(){
    return this.formCadastro.get('url');
  }

  get descricao(){
    return this.formCadastro.get('descricao');
  }

  salvar(){

    this.foto = {...this.foto, ...this.formCadastro.value} 

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
              this.formCadastro.reset()
            }
            ,() => {this.mensagem.texto = `Erro ao Cadastrar!`, this.mensagem.tipo = 'danger'}
          )
    }
  }
}
