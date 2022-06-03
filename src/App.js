import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import { BsPencilSquare } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";



class App extends Component {

  
  change_idPrestamo(e){
    this.setState({
      idPrestamo: e.target.value
    })
  }
  
  change_idLibro(e){
    this.setState({
      idLibro: e.target.value
    })
  }
  
  change_idUsuario(e){
    this.setState({
      idUsuario: e.target.value
    })
  }
  
  change_fecPrestamo(e){
    this.setState({
      fecPrestamo: e.target.value
    })
  }
  
  change_fecDevolucion(e){
    this.setState({
      fecDevolucion: e.target.value
    })
  }

  mostrar(cod, index){
    axios.get('http://127.0.0.1:8000/prestamos/'+cod+'/')
    .then(res=>{
      this.setState({
        pos: index,
        titulo: 'Editar',
        id: res.data.id,
        idPrestamo: res.data.idPrestamo,
        idLibro: res.data.idLibro,
        idUsuario: res.data.idUsuario,
        fecPrestamo: res.data.fecPrestamo,
        fecDevolucion: res.data.fecDevolucion
      })
    });
  }

  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    let datos = {
      idPrestamo: this.state.idPrestamo,
      idLibro: this.state.idLibro,
      idUsuario: this.state.idUsuario,
      fecPrestamo: this.state.fecPrestamo,
      fecDevolucion: this.state.fecDevolucion
    }
    if(cod>0){//Editamos un registro
      axios.put('http://127.0.0.1:8000/prestamos/'+cod+'/',datos)
      .then(res =>{
        let indx = this.state.pos;
        this.state.prestamos[indx] = res.data;
        var temp = this.state.prestamos;
        this.setState({
          pos: null,
          titulo: 'Nuevo',
          id:'',
          idPrestamo: '',
          idLibro: '',
          idUsuario: '',
          fecPrestamo: '',
          fecDevolucion: '',
          prestamos: temp
        });
      }).catch((error)=>{
        console.log(error.toString());
      });
    }else{//Nuevo registro
      axios.post('http://127.0.0.1:8000/prestamos/',datos)
      .then(res=>{
        this.state.prestamos.push(res.data);
        var temp = this.state.prestamos;
        this.setState({
          id:'',
          idPrestamo: '',
          idLibro: '',
          idUsuario: '',
          fecPrestamo: '',
          fecDevolucion: '',
          prestamos: temp
        }).catch((error)=>{
          console.log(error.toString());
        })
      })
    }
  }

  eliminar(cod){
    let rpta = window.confirm("Desea eliminar?");
    if(rpta){
      axios.delete('http://127.0.0.1:8000/prestamos/'+cod+'/')
      .then(res => {
        var temp = this.state.prestamos.filter((prestamo)=>prestamo.id !== cod);
        this.setState({
          prestamos: temp
        })
      })
    }
  }

  componentWillMount(){
    axios.get('http://127.0.0.1:8000/prestamos')
    .then(res => {
      this.setState({ prestamos: res.data })
    })
  }

  constructor(props) {
    super(props);
    this.state=({
      prestamos: [],
      pos: null,
      titulo: 'Nuevo',
      id:'',
      idPrestamo: '',
      idLibro: '',
      idUsuario: '',
      fecPrestamo: '',
      fecDevolucion: ''
    })
  
    this.change_idPrestamo = this.change_idPrestamo.bind(this);
    this.change_idLibro= this.change_idLibro.bind(this);
    this.change_idUsuario= this.change_idUsuario.bind(this);
    this.change_fecPrestamo= this.change_fecPrestamo.bind(this);
    this.change_fecDevolucion = this.change_fecDevolucion.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);

  }
  render() {
    return (
    <div class="container py-5">
      <h1>Lista de Prestamos</h1>
      <table  class="table table-hover table-dark">
        <thead>
          <tr>
            <th>EJEMPLAR</th>
            <th>LIBRO</th>
            <th>USUARIO</th>
            <th>INICIO</th>
            <th>FIN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {this.state.prestamos.map( (prestamo,index) =>{
            return (
              <tr key={prestamo.id}>
                <td>{prestamo.idPrestamo}</td>
                <td>{prestamo.idLibro}</td>
                <td>{prestamo.idUsuario}</td>
                <td>{prestamo.fecPrestamo}</td>
                <td>{prestamo.fecDevolucion}</td>
                <td>
                  <button class="btn btn-success" onClick={()=>this.mostrar(prestamo.id,index)}><BsPencilSquare/></button>
                  <button class="btn btn-danger" onClick={()=>this.eliminar(prestamo.id)}><BsTrashFill/></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <hr />
      <h1>{this.state.titulo}</h1>
      <form class="needs-validation" onSubmit={this.guardar}>
      <input type="hidden" value={this.state.id}></input>
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <label>EJEMPLAR</label>
            <input type="text" value={this.state.idPrestamo} onChange={this.change_idPrestamo} class="form-control" required/>
          </div>
          <div class="col-md-6 mb-3">
            <label>LIBRO</label>
            <input type="text" value={this.state.idLibro} onChange={this.change_idLibro}class="form-control" required/>
          </div>
          <div class="col-md-6 mb-3">
            <label>USUARIO</label>
            <input type="text" value={this.state.idUsuario} onChange={this.change_idUsuario} class="form-control" required/>
          </div>
          <div class="col-md-6 mb-3">
            <label>FECHA DE PRESTAMO</label>
            <input type="date" value={this.state.fecPrestamo} onChange={this.change_fecPrestamo} class="form-control" required/>
          </div>
          <div class="col-md-6 mb-3">
            <label>FECHA DE DEVOLUCION</label>
            <input type="date" value={this.state.fecDevolucion} onChange={this.change_fecDevolucion} class="form-control" required/>
          </div>
        </div>
        <button class="btn btn-primary" type="submit">Enviar</button>
      </form>
    </div>
    
    
    )
  }
}
export default App;

