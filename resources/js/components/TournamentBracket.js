import React, { Component } from 'react';
import './TournamentBracket.css';
import axios from 'axios';


export default class TournamentBracket extends Component {

    constructor(){
        super();
        this.state = {
            octavos: [],
            cuartos: [" ? ", " ? ", " ? ", " ? ", " ? ", " ? ", " ? ", " ? "],
            semis: [" ? ", " ? ", " ? ", " ? "],
            final: [" ? ", " ? "],
            campeon: " ? ",
            prodes: [],
            prode_id: null,
            
        }
        this.handleClickOctavos = this.handleClickOctavos.bind(this);
        this.handleClickCuartos = this.handleClickCuartos.bind(this);
        this.handleClickSemis = this.handleClickSemis.bind(this);
        this.handleClickFinal = this.handleClickFinal.bind(this);
        this.save = this.save.bind(this);
        this.search = this.search.bind(this);
        this.edit = this.edit.bind(this);
        this.newProde = this.newProde.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount(){
        window.axios = require('axios');
        let api_token = document.querySelector('meta[name="api-token"]');
        let token = document.head.querySelector('meta[name="csrf-token"]');
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
        window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + api_token.content;
        var self = this;
        axios.get('/api/teams')
             .then(function (response) {
                self.setState({octavos: response.data})
             })
            .catch(function (error) {
               console.log(error);
            });
        axios.get('/api/prode')
            .then(function (response) {
               self.setState({prodes: response.data})
            })
           .catch(function (error) {
              console.log(error);
           });
        
    }

    search(e){
        var id = e.target.id;
        var self = this;
        axios.get('/api/prode/'+id)
         .then(function (response) {
            var octavos = response.data[0]['octavos'].split(',');
            var cuartos = response.data[0]['cuartos'].split(',');
            var semis = response.data[0]['semis'].split(',');
            var final = response.data[0]['final'].split(',');
            var campeon = response.data[0]['champ'];

            self.setState({
                octavos: octavos,
                cuartos: cuartos,
                semis: semis,
                final: final,
                campeon: campeon,
                prode_id: id,
            });
         })
        .catch(function (error) {
           console.log(error);
        });
    }

    

    save(){
            var self = this;
            axios.post('api/prode', {
                data: self.state
            }).then(function (response) {
                self.setState({
                    prodes: response.data
                });
                alert("El pronostico fue guardado con exito")
            }).catch(function (error) {
              console.log(error);
            });
        
    }

    edit(){
        var self = this;
        if(this.state.prode_id != null){
        axios.put('api/prode/' + this.state.prode_id, {
            data: self.state
        }).then(function (response) {
            alert("El pronostico fue editado con exito")
        }).catch(function (error) {
          console.log(error);
        });
        }
        else{alert("No se puede editar un pronostico que todavia no fue guardado")}
    }

    delete(){
        var self = this;
        var result = confirm("Are you sure to delete?");
        if(result){
        axios.delete('api/prode/' + this.state.prode_id, {
        }).then(function (response) {
            self.setState({
                prodes: response.data
            });
            alert("Prode eliminado")
        }).catch(function (error) {
        console.log(error);
        });
        }
    }

    newProde(){
        this.setState({
            cuartos: ["", "", "", "", "", "", "", ""],
            semis: ["", "", "", ""],
            final: ["", ""],
            campeon: '',            
            prode_id: null,
        });
    }

    getTeamImage(team){
        switch(team){
            case "River": return "http://www.promiedos.com.ar/images/s64/riverplate.png";
            case "Boca": return "http://www.promiedos.com.ar/images/s64/bocajuniors.png";
            case "Godoy Cruz": return "http://www.promiedos.com.ar/images/s64/godoycruz.png";
            case "Palmeiras": return "http://www.promiedos.com.ar/images/s64/palmeiras.png";
            case "Flamengo": return "http://www.promiedos.com.ar/images/s64/flamengo.png";
            case "Liga de Quito": return "http://www.promiedos.com.ar/images/s64/ligaquito.png";
            case "Gremio": return "http://www.promiedos.com.ar/images/s64/gremio.png";
            case "Libertad": return "http://www.promiedos.com.ar/images/s64/libertadp.png";
            case "San Lorenzo": return "http://www.promiedos.com.ar/images/s64/sanlorenzo.png";
            case "Internacional": return "http://www.promiedos.com.ar/images/s64/internacional.png";
            case "Nacional": return "http://www.promiedos.com.ar/images/s64/nacional.png";
            case "Olimpia": return "http://www.promiedos.com.ar/images/s64/olimpia.png";
            case "Paranaense": return "http://www.promiedos.com.ar/images/s64/paranaense.png";
            case "Cerro Porteño": return "http://www.promiedos.com.ar/images/s64/cerroporteno.png";
            case "Cruzeiro": return "http://www.promiedos.com.ar/images/s64/cruzeiro.png";
            case "Emelec": return "http://www.promiedos.com.ar/images/s64/emelec.png";
            case " ? ": return null;
        }
    }

    handleClickOctavos(index) {
        var cuartosAux = this.state.cuartos;
        var newIndex =Math.floor(index/2); 
        cuartosAux[newIndex] = this.state.octavos[index];
        this.setState({
            cuartos: cuartosAux 
        });
        if(this.state.semis[Math.floor(newIndex/2)] != ' ? '){
           this.handleClickCuartos(newIndex); 
        }        
      }
    
    handleClickCuartos(index) {
        var semisAux = this.state.semis;
        var newIndex =Math.floor(index/2);         
        semisAux[Math.floor(index/2)] = this.state.cuartos[index];
        this.setState({
            semis: semisAux 
        })
        if(this.state.final[Math.floor(newIndex/2)] != ' ? '){
            this.handleClickSemis(newIndex); 
         }    
    }

    handleClickSemis(index) {
        var finalAux = this.state.final;
        var newIndex =Math.floor(index/2); 
        finalAux[Math.floor(index/2)] = this.state.semis[index];
        this.setState({
            final: finalAux 
        })
        if(this.state.campeon != ' ? '){
            this.handleClickFinal(newIndex); 
         }
        
    }
    
    handleClickFinal(index) {
       
        this.setState({
            campeon: this.state.final[index]  
        });
    }




 

    
    render() {
        return <div>
        
    
        <header className="hero">
        <div className="hero-wrap">
         <p className="intro" id="intro">-Conmebol-</p>
             <h1 id="headline">Libertadores</h1>
             <p className="year"><i className="fa fa-star"></i> 2019 <i className="fa fa-star"></i></p>
             <img src="https://www.directv.com.ar/Shared/Images/deportes/copa-libertadores/Copa-libertadores.png" alt="Copa Libertadores Logo"/>

       </div>
        </header>     
    
    
        <section id="bracket">
        <div className="jumbotron">
        <div className="row">
                    <div className="col-sm">
                        <div className="list-group">
                            <a className="list-group-item list-group-item-success">Lista de prodes</a>
                            {this.state.prodes.map((prode, i) =>
                                <button type="button"
                                id = {prode.id} 
                                className="list-group-item list-group-item-action" 
                                onClick={this.search}>
                                   Mi Pronostico, creado: {prode.created_at}, identificador: {prode.id}
                                </button>
                            )}
                        </div>
                        <button onClick={() => this.save()} className="button .btn-success">Guardar</button>
                        <button onClick={() => this.delete()} className="button .btn-success">Eliminar</button>
                        <button onClick={() => this.edit()} className="button .btn-success">Editar</button>
                        <button onClick={() => this.newProde()} className="button .btn-success">Nuevo Prode</button>
                    </div>
        </div>
        </div>
        <div className="round-details">Mi Pronostico, identificador: {this.state.prode_id}<br/><span className="date"></span></div>  
        <div className="container">   
        
        <div className="split split-one">
            <div className="round round-two">
            <div className="round-details">Octavos de final<br/><span className="date"></span></div>       
                <ul className="matchup">
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[0])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(0)} className="button">{this.state.octavos[0]}</button></li>
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[1])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(1)} className="button">{this.state.octavos[1]}</button></li>  
                </ul>
                <ul className="matchup">
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[2])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(2)} className="button">{this.state.octavos[2]}</button></li>
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[3])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(3)} className="button">{this.state.octavos[3]}</button></li>  
                </ul>
                <ul className="matchup">
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[4])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(4)} className="button">{this.state.octavos[4]}</button></li>
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[5])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(5)} className="button">{this.state.octavos[5]}</button></li>  
                </ul>
                <ul className="matchup">
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[6])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(6)} className="button">{this.state.octavos[6]}</button></li>
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[7])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(7)} className="button">{this.state.octavos[7]}</button></li>  
                </ul>

               
            </div>  
            
            <div className="round round-three">
                <div className="round-details">Cuartos de final<br/><span className="date"></span></div>              
                <ul className="matchup">
                <li className="team team-top"><span className="score"><img src= {this.getTeamImage(this.state.cuartos[0])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickCuartos(0)} className="button">{this.state.cuartos[0]}</button></li>                  
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.cuartos[1])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickCuartos(1)} className="button">{this.state.cuartos[1]}</button></li>   
                </ul>   
                <ul className="matchup">
                <li className="team team-top"><span className="score"><img src= {this.getTeamImage(this.state.cuartos[2])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickCuartos(2)} className="button">{this.state.cuartos[2]}</button></li>                  
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.cuartos[3])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickCuartos(3)} className="button">{this.state.cuartos[3]}</button></li>   
                </ul>                                       
            </div>          
        </div> 
    
    <div className="champion">
            <div className="semis-l">
                <div className="round-details">Semifinal 1<br/><span className="date"></span></div>     
                <ul className ="matchup championship">
                <li className="team team-top"><span className="score"><img src= {this.getTeamImage(this.state.semis[0])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickSemis(0)} className="button">{this.state.semis[0]}</button></li>                  
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.semis[1])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickSemis(1)} className="button">{this.state.semis[1]}</button></li>  
                </ul>
            </div>
            <div className="final">
            <div className="round-details">Campeon Libertadores 2019: {this.state.campeon} <br/><span className="date"></span></div>  
                <i className="fa fa-trophy"></i>
                <div className="round-details">Final <br/><span className="date"></span></div>      
                <ul className ="matchup championship">
                <li className="team team-top"><span className="score"><img src= {this.getTeamImage(this.state.final[0])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickFinal(0)} className="button">{this.state.final[0]}</button></li>                  
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.final[1])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickFinal(1)} className="button">{this.state.final[1]}</button></li>  
                </ul>
            </div>
            <div className="semis-r">       
                <div className="round-details">Semifinal 2 <br/><span className="date"></span></div>     
                <ul className ="matchup championship">
                <ul className ="matchup championship">
                <li className="team team-top"><span className="score"><img src= {this.getTeamImage(this.state.semis[2])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickSemis(2)} className="button">{this.state.semis[2]}</button></li>                  
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.semis[3])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickSemis(3)} className="button">{this.state.semis[3]}</button></li>  
                </ul>
                </ul>
            </div>  
        </div>
    
    
        <div className="split split-two">
    
    
        <div className="round round-three">
                <div className="round-details">Cuartos de final<br/><span className="date"></span></div>              
                <ul className="matchup">
                <li className="team team-top"><span className="score"><img src= {this.getTeamImage(this.state.cuartos[4])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickCuartos(4)} className="button">{this.state.cuartos[4]}</button></li>                  
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.cuartos[5])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickCuartos(5)} className="button">{this.state.cuartos[5]}</button></li>   
                </ul>   
                <ul className="matchup">
                <li className="team team-top"><span className="score"><img src= {this.getTeamImage(this.state.cuartos[6])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickCuartos(6)} className="button">{this.state.cuartos[6]}</button></li>                  
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.cuartos[7])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickCuartos(7)} className="button">{this.state.cuartos[7]}</button></li>   
                </ul>                                       
            </div> 
            <div className="round round-two">
            <div className="round-details">Octavos de final<br/><span className="date"></span></div>       
                <ul className="matchup">
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[8])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(8)} className="button">{this.state.octavos[8]}</button></li>
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[9])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(9)} className="button">{this.state.octavos[9]}</button></li>  
                </ul>
                <ul className="matchup">
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[10])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(10)} className="button">{this.state.octavos[10]}</button></li>
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[11])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(11)} className="button">{this.state.octavos[11]}</button></li>  
                </ul>
                <ul className="matchup">
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[12])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(12)} className="button">{this.state.octavos[12]}</button></li>
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[13])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(13)} className="button">{this.state.octavos[13]}</button></li>  
                </ul>
                <ul className="matchup">
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[14])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(14)} className="button">{this.state.octavos[14]}</button></li>
                    <li className="team team-bottom"><span className="score"><img src= {this.getTeamImage(this.state.octavos[15])} width="26px" height="26px" alt=" ? "/>
                    </span><button onClick={() => this.handleClickOctavos(15)} className="button">{this.state.octavos[15]}</button></li>  
                </ul>

               
            </div>                   
        </div>
        </div>
       
        </section>
        
        </div>      
    }
}
