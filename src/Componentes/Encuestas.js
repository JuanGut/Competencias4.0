import { formatMs } from "@material-ui/core";
import React, { Component, useState, useEffect } from "react";
import './../Estilos/encuesta.css';
import Cuerpo from "./Cuerpo";
import Formulario from "./Formulario";
import swal from 'sweetalert';
import db from "../firebaseConfig";
import { onSnapshot, collection, doc, getDoc, query } from "firebase/firestore";



export default function Encuestas() {
  window.bandCuest = null;
  window.modulo=null;
  const [modulo1, setModulo1] = useState(false);
  const [modulo2, setModulo2] = useState(false);
  const checkbtn = document.getElementById('moduloEncuesta');
  const respuestaC="";
  const reinicio= [];
  var pregModulo = [];
  var preguntas = [];
  var respuestas = [];
  var respuestasModulo = [];
  var contenidoRespuesta = "";
  var aleatorios = [];
  var aleatoriosRespuesta=[];
  var preguntasMostradas=[];
  var respuestaCorrecta=[];
  const modificarForm = (event) => {
    const btn1 = document.getElementById('v-pills-con-tab');
    const btn2 = document.getElementById('v-pills-compdi-tab');
    const btn3 = document.getElementById('v-pills-act-tab');
    window.modulo=document.getElementById(event.target.id).innerText;
    console.log(window.modulo);

    if (window.bandCuest == false) {
      swal(
        {
          title: "Realizando encuesta",
          text: "Se está realizando una encuesta",
          icon: "info",
          button: "Aceptar",
          timer: "5000"
        }
      );
    }
    else {

      swal(
        {
          title: "Comenzar encuesta",
          text: "No podrá salir de la encuesta hasta finalizar la misma",
          icon: "info",
          buttons: ["No", "Si"],
          timer: "5000"
        }
      ).then(respuesta => {
        if (respuesta) {
          btn1.disabled = true;
          btn2.disabled = true;
          btn3.disabled = true;
          window.bandCuest = false;
          swal({
            text: "Ha iniciado la encuesta",
            icon: "success"

          })
          const formula = document.getElementById('divForm');
          formula.style.display = 'block';
          event.target.disabled = true;
        }
      });
    }
    añadirPreguntas(window.modulo);
    
    


  }
  const [pregunta, setPregunta] = useState([{ name: "Loading...", id: "initial" }]);
 

  useEffect(
    () =>
      onSnapshot(collection(db, "Pregunta"), (snapshot) =>
        setPregunta(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );

  const obtenerRespuestaCorrecta = (step) =>
  {
    const respuestaFormulario= document.getElementById('r' + (step));
    respuestaFormulario.value='C';
  }
  const obtenerRespuestas = async (ref, inicio) => {
    var document = await getDoc(ref);
    var contenido = document.get("texto");
    var valorRespuesta= document.get("valor");
    if(valorRespuesta==true)
    {
        respuestaCorrecta=contenido;
    }
    contenidoRespuesta = contenido;
    respuestasModulo.push(contenidoRespuesta);

    if ((respuestasModulo.length%4)==0) {
      var inicial = 4 * inicio;
      var final =inicial+4;
      llenarArregloRespuestasAleatorias(respuestasModulo.length);
      for (let step = inicial; step < final; step++) {
        var posicion = aleatoriosRespuesta[0];
        if(respuestasModulo[posicion]== respuestaCorrecta)
        {
          obtenerRespuestaCorrecta(step+1);    
        }
        respuestas[step].innerText = respuestasModulo[posicion];
        aleatoriosRespuesta.splice(0,1);
      }
    }

  }

  const añadirRespuestas = (modulo, numPreguntas, inicio) => {

    for (let index2 = 0; index2 < 4; index2++) {
      const docRef2 = doc(db, "Modulo", modulo, "Preguntas", "Pregunta" + numPreguntas, "Respuestas", "Respuesta" + (index2 + 1));
      obtenerRespuestas(docRef2, inicio);
    }

  }
  const llenarArregloRespuestasAleatorias = (numeroRespuestas) => {

    var inicio=numeroRespuestas-4;
    for (let index = inicio; index < numeroRespuestas; index++) {
      aleatoriosRespuesta.push(index);
    }
    var i, j, k;
    for (i = aleatoriosRespuesta.length; i; i--) {
      j = Math.floor(Math.random() * i);
      k = aleatoriosRespuesta[i - 1];
      aleatoriosRespuesta[i - 1] = aleatoriosRespuesta[j];
      aleatoriosRespuesta[j] = k;
    }
  }
  const llenarArregloPreguntasAleatoriasMostrar = (numeroPreg) => {
    for (let index = 0; index < numeroPreg; index++) {
      preguntasMostradas.push(index);
    }
    var i, j, k;
    for (i = preguntasMostradas.length; i; i--) {
      j = Math.floor(Math.random() * i);
      k = preguntasMostradas[i - 1];
      preguntasMostradas[i - 1] = preguntasMostradas[j];
      preguntasMostradas[j] = k;
    }
  }
  const añadirPreguntas = async (modulo) => {

    var snap = null;
    llenarArregloPreguntasAleatoriasMostrar(10);
    console.log(preguntasMostradas);
    for (let index = 0; index < 5; index++) {
      var posicion=preguntasMostradas[index];
      const collectionPreg= collection(db,"Modulo", modulo, "Preguntas");
      var cantidadPreguntas=collectionPreg.length;
      const q=query(collection(db, "Modulo", modulo, "Pregunta"));
      console.log(cantidadPreguntas);
      const docRef = doc(db, "Modulo", modulo, "Preguntas", "Pregunta" + (posicion + 1));
      snap = await getDoc(docRef);
      console.log(snap);
      if(snap != null)
      {
        pregModulo.push(snap.get("texto"));
      }
      else
      {
        pregModulo.length=pregModulo.length-1;
      }
    }
    var aux = pregModulo.length;
    for (let step = 0; step < aux; step++) {
      var posicion2= preguntasMostradas[step];
      console.log(preguntas);
      preguntas[step].innerText = (step + 1) + ") " + pregModulo[step];
      añadirRespuestas(modulo, (posicion2 + 1), step);
    }
    preguntasMostradas.splice(0,preguntasMostradas.length);
    pregModulo.splice(0,pregModulo.length);
    console.log(preguntasMostradas);
    console.log(pregModulo);

    


  }
  const modificarModulos = (event) => {


    const formul = document.getElementById('v-pills-tabContent');
    formul.style.display = 'block';

    for (let step = 1; step < 6; step++) {

      const aux = document.getElementById('pregunta' + step);
      preguntas.push(aux);

    }
    for (let step = 1; step < 21; step++) {

      const aux = document.getElementById('respuesta' + step);
      respuestas.push(aux);

    }
  }
  return (
    <div id="menuEncuesta" class="mencuesta">

      <div class="nav flex-column nav-pills me-3" id="botones" role="tablist" aria-orientation="vertical">
        <h2 id="area">AREAS</h2>
        <button class="btn btn-success" onClick={(e) => { modificarModulos(e) }} id="v-pills-con-tab" data-bs-toggle="pill" data-bs-target="#v-pills-con" type="button" role="tab" aria-controls="v-pills-con" aria-selected="true" >Conocimiento</button>
        <button class="btn btn-success" onClick={(e) => { modificarModulos(e) }} id="v-pills-compdi-tab" data-bs-toggle="pill" data-bs-target="#v-pills-compdi" type="button" role="tab" aria-controls="v-pills-compdi" aria-selected="true">Competencias digitales</button>
        <button class="btn btn-success" onClick={(e) => { modificarModulos(e) }} id="v-pills-act-tab" data-bs-toggle="pill" data-bs-target="#v-pills-act" type="button" role="tab" aria-controls="v-pills-act" aria-selected="true">Actitud</button>
      </div>
      <div class="tab-content" id="v-pills-tabContent">
        <div class="tab-pane fade show active" id="v-pills-con" role="tabpanel" aria-labelledby="v-pills-con-tab">
          <h2 id="modulo">MODULOS</h2>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="informacion contable" data-bs-toggle="pill" data-bs-target="#v-pills-infcont" type="button" role="tab" aria-controls="v-pills-infcont" aria-selected="true" >Informacion Contable</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="gestion de organizaciones" data-bs-toggle="pill" data-bs-target="#v-pills-gesorg" type="button" role="tab" aria-controls="v-pills-gesorg" aria-selected="true" >Gestion de organizaciones</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="analisis economico" data-bs-toggle="pill" data-bs-target="#v-pills-anec" type="button" role="tab" aria-controls="v-pills-anec" aria-selected="true" >Analisis Economico</button>
          
        </div>
        <div class="tab-pane fade" id="v-pills-compdi" role="tabpanel" aria-labelledby="v-pills-profile-tab">
          <h2 id="modulo">MODULOS</h2>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="conocimiento digital" data-bs-toggle="pill" data-bs-target="#v-pills-contdig" type="button" role="tab" aria-controls="v-pills-contdig" aria-selected="true" >Conocimiento Digital</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="comunicacion digital" data-bs-toggle="pill" data-bs-target="#v-pills-comdig" type="button" role="tab" aria-controls="v-pills-comdig" aria-selected="true" >Comunicacion Digital</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="gestion de la informacion" data-bs-toggle="pill" data-bs-target="#v-pills-gesin" type="button" role="tab" aria-controls="v-pills-gesin" aria-selected="true" >Gestion de la informacion</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="Liderazgo en red" data-bs-toggle="pill" data-bs-target="#v-pills-lider" type="button" role="tab" aria-controls="v-pills-lider" aria-selected="true" >Liderazgo en red</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="Trabajo en red" data-bs-toggle="pill" data-bs-target="#v-pills-gesin" type="button" role="tab" aria-controls="v-pills-gesin" aria-selected="true" >Trabajo en red</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="Aprendizaje continuo" data-bs-toggle="pill" data-bs-target="#v-pills-gesin" type="button" role="tab" aria-controls="v-pills-gesin" aria-selected="true" >Aprendizaje Continuo</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="Vision estrategica" data-bs-toggle="pill" data-bs-target="#v-pills-gesin" type="button" role="tab" aria-controls="v-pills-gesin" aria-selected="true" >Vision Estrategica</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="Orientacion al cliente" data-bs-toggle="pill" data-bs-target="#v-pills-gesin" type="button" role="tab" aria-controls="v-pills-gesin" aria-selected="true" >Orientacion al cliente</button>


        </div>
        <div class="tab-pane fade" id="v-pills-act" role="tabpanel" aria-labelledby="v-pills-act-tab">
          <h2 id="modulo">MODULOS</h2>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="pensamiento critico" data-bs-toggle="pill" data-bs-target="#v-pills-pencri" type="button" role="tab" aria-controls="v-pills-pencri" aria-selected="true" >Pensamiento Critico</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="pensamiento analitico" data-bs-toggle="pill" data-bs-target="#v-pills-penana" type="button" role="tab" aria-controls="v-pills-penana" aria-selected="true" >Pensamiento Analítico</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="resolucion de problemas" data-bs-toggle="pill" data-bs-target="#v-pills-respro" type="button" role="tab" aria-controls="v-pills-respro" aria-selected="true" >Solucion de problemas</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="Innovación, originalidad e iniciativa" data-bs-toggle="pill" data-bs-target="#v-pills-respro" type="button" role="tab" aria-controls="v-pills-respro" aria-selected="true" >Innovacion, Originalidad e iniciativa</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="Análisis y evolución de sistemas" data-bs-toggle="pill" data-bs-target="#v-pills-respro" type="button" role="tab" aria-controls="v-pills-respro" aria-selected="true" >Analisis y evolucion de sistemas</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="Diseño y programación de nuevas tecnologías" data-bs-toggle="pill" data-bs-target="#v-pills-respro" type="button" role="tab" aria-controls="v-pills-respro" aria-selected="true" >Diseño y programacion de nuevas tecnologias</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="Liderazgo e influencia social" data-bs-toggle="pill" data-bs-target="#v-pills-respro" type="button" role="tab" aria-controls="v-pills-respro" aria-selected="true" >Liderazgo e influencia social</button>
          <button onClick={(e) => { modificarForm(e) }} class="btn1" id="Inteligencia emocional" data-bs-toggle="pill" data-bs-target="#v-pills-respro" type="button" role="tab" aria-controls="v-pills-respro" aria-selected="true" >Inteligencia Emocional</button></div>
      </div>
      <br />
      <div id="divForm" class="form">
        <Formulario />
      </div>
    </div>

  );
}




