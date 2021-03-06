import React, { Component, useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Container, ButtonGroup, Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import './../Estilos/buttongroup.css';
import infCont1 from './../Recursos/img-informacionContable.jpg';
import { onSnapshot, collection } from "firebase/firestore";
import db from "../firebaseConfig";



const modificarCont = (event) => {
    const boton1 = document.getElementById('btM1');
    const boton2 = document.getElementById('btM2');
    const boton3 = document.getElementById('btM3');
    const contLorem = document.getElementById('contLor');
    const contImg = document.getElementById('imgCont');
    const descTab1 = document.getElementById('desc1');
    const descTab2 = document.getElementById('desc2');
    const descTab3 = document.getElementById('desc3');
    const botonTab1 = document.getElementById('btnCP1');
    const botonTab2 = document.getElementById('btnCP2');
    const botonTab3 = document.getElementById('btnCP3');
    if (event.target.id == "btM1") {
        if (boton1.innerText == 'Información contable') {
            contLorem.innerHTML = "";
            contImg.src = infCont1;
            descTab1.innerText="Tabla-inf contable";
            descTab2.innerText="Tabla2-inf contable";
            descTab3.innerText="Tabla3-inf contable";

        }
        if (boton1.innerText == 'Conocimiento digital') {
            contLorem.innerHTML = 'Este es el bloque de Conocimiento digital';
            contImg.src = "";
        }
        if (boton1.innerText == 'Pensamiento crítico') {
            contLorem.innerHTML = 'Este es el bloque de PC';
            contImg.src = "";
        }
    }
    else {
        if (event.target.id == "btM2") {
            if (boton2.innerText == 'Gestión de organizaciones') {
                contLorem.innerHTML = 'Este es el bloque de Ges org';
                contImg.src = "";
            }
            if (boton2.innerText == 'Comunicación digital') {
                contLorem.innerHTML = 'Este es el bloque de Com Digital';
                contImg.src = "";
            }
            if (boton2.innerText == 'Pensamiento analítico') {
                contLorem.innerHTML = 'Este es el bloque de Pens analítico';
                contImg.src = "";
            }


        }
        else {
            if (event.target.id == "btM3") {
                if (boton3.innerText == 'Análisis económico') {
                    contLorem.innerHTML = 'Este es el bloque de Analis econ';
                    contImg.src = "";
                }
                if (boton3.innerText == 'Gestión de la información') {
                    contLorem.innerHTML = 'Este es el bloque de Ges inf';
                    contImg.src = "";
                }
                if (boton3.innerText == 'Resolución de problemas') {
                    contLorem.innerHTML = 'Este es el bloque de Res problem';
                    contImg.src = "";
                }

            }
        }
    }
}
export default function ModulosGestor() {

    const [pregunta, setPregunta] = useState([{ name: "Loading...", id: "initial" }]);

    useEffect(
        () =>
            onSnapshot(collection(db, "Pregunta"), (snapshot) =>
                setPregunta(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            ),
        []
    );
    return (
        <div class="btn-groupM" role="group" aria-label="Basic example">
            <button onClick={(e) => { modificarCont(e) }} id="btM1" type="button" class="btn btn-success"></button>
            <button onClick={(e) => { modificarCont(e) }} id="btM2" type="button" class="btn btn-success"></button>
            <button onClick={(e) => { modificarCont(e) }} id="btM3" type="button" class="btn btn-success"></button>
            <ul>
                {pregunta.map((p) => (
                    <li key={p.id}>
                        <a href="#">{p.texto}</a>
                    </li>
                ))}
            </ul>
        </div>
    );

}