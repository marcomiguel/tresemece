import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { toLines, removeEmptyLines, replaceQuotes } from './helpers';

let fileChange = null;
let departaments = [];

class Ubigeo extends Component {

  constructor(props){
    super(props);
  }

  render(){
    const { departaments } = this.props;
    return(
      <div>
        <h4>DEPARTAMENTO</h4>
        <table id="departaments">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Código Padre</th>
              <th>Descripción Padre</th>
            </tr>
          </thead>
          <tbody>
            { departaments.map((departament, index) => 
              <tr key={'departament'+index}>
                <td>{departament.code}</td>
                <td>{departament.name}</td>
                <td>-</td>
                <td>-</td>
              </tr>)
            }
          </tbody>
        </table>
        <h4>PROVINCIA</h4>
        <table id="provinces">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Código Padre</th>
              <th>Descripción Padre</th>
            </tr>
          </thead>
          <tbody>
            { departaments.map( departament => departament.provinces.map( (province, index) => 
              <tr key={'province'+index}>
                <td>{province.code}</td>
                <td>{province.name}</td>
                <td>{departament.code}</td>
                <td>{departament.name}</td>
              </tr>))
            }
          </tbody>
        </table>
        <h4>DISTRITO</h4>
        <table id="districts">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Código Padre</th>
              <th>Descripción Padre</th>
            </tr>
          </thead>
          <tbody> 
            { departaments.map( departament => departament.provinces.map( (province) => province.districts.map( (district, index) => 
              <tr key={'district'+index}>
                <td>{district.code}</td>
                <td>{district.name}</td>
                <td>{province.code}</td>
                <td>{province.name}</td>
              </tr>)) )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

class App extends Component {
  
  state = {
    departaments: []
  }

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  exist = function(array, code){
    var idx = -1;
    for(var i = 0; i < array.length; i++){
      var temp = array[i];
      if(temp.code === code){
        idx = i;
        break;
      }
    }
    return idx;
  };

  readData = function(line){
    var segment = line.split('/');
    var departament = segment[0].trim();
    var province = segment[1].trim();
    var district = segment[2].trim();
    var departamentCode = departament.substr(0, 2);				
		var departamentName = departament.substr(2, departament.length - 2);
    var existDepartament = this.exist(departaments, departamentCode);
    if(existDepartament === -1){
		  departaments.push({
        code : departamentCode,
        name : departamentName,
        provinces : []
      });
    }else{
      var provinceCode = province.substr(0, 2);				
      var provinceName = province.substr(2, province.length - 2);
      var existProvince = this.exist(departaments[existDepartament].provinces, provinceCode);
      if(existProvince === -1){
        departaments[existDepartament].provinces.push({
          code : provinceCode,
          name : provinceName,
          districts : []
        });
      }else{
        var districtCode = district.substr(0, 3);				
        var districtName = district.substr(3, district.length-3);
        var existDistrict = this.exist(departaments[existDepartament].provinces[existProvince].districts, districtCode);
        departaments[existDepartament].provinces[existProvince].districts.push({
          code : districtCode,
          name : districtName
        });
      }
    }
    console.log(departaments);
    this.setState({ departaments: departaments });
  };

  generate = (array) => {
    var self = this;
    for(var i = 0; i < array.length; i++){
      this.readData(array[i]); 
    }
  }

  handleChange(selectorFiles){
    // console.log('handleChange', selectorFiles);
    let file = selectorFiles[0];
		let reader = new FileReader();
		reader.onload = (event) =>{
      let txt = replaceQuotes(event.target.result);
      let lines = toLines(txt);
      let clean = removeEmptyLines(lines);
      this.generate(clean);
		};
		reader.readAsText(file);
  }

  handleUpload = () => {
    fileChange.click();
  }

  // clickGenerate(){
  //   console.log('click generate');  
  // }

  render(){
    const { departaments } = this.state;
    return(
      <div className="row">
        <div className="small-10 small-centered columns">
          <label htmlFor="file" className="button" onClick={ this.handleUpload }>
            Cargar archivo
          </label>
          <input
            type="file"
            className="show-for-sr"
            id="upload-file"
            onChange={ (e) => this.handleChange(e.target.files) }
            ref={ (input) => { fileChange = input; }}
          />
        </div>
        
        <Ubigeo departaments={departaments}/> 
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);

// <div>
//  <button type="button" onClick={this.clickGenerate}>Generar</button>
// </div>