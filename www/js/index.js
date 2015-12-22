/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var cargarDB = {
    db: "",
    initialize: function(){
        this.db = window.openDatabase("localDB", "1.0", "Base de datos de prueba", 2*1024*1024);
        this.cargarDB();
    },

    cargarDB: function(){
        console.log("CARGA DE BBDD YA EXISTENTE");
        this.db.transaction(this.mostrarDB, this.mostrarDBError);
    },

    mostrarDB: function(tx){
        var sql = "SELECT * FROM localDB ORDER BY ultimos DESC;";
        console.log("SE LANZA LA CONSULTA SQL PARA CARGAR LA TABLA");
        tx.executeSql(
            sql,
            [], 
            function(tx, result){
                console.log("CONSULTA REALIZADA, RECUPERANDO DATOS");
                if(result.rows.length>0){
                    for(var i=0; i<result.rows.length; i++){
                        var fila = result.rows.item(i);
                        //Actualizar html para cargar datos de la BBDD
                        console.log("ROW "+i+" nombre: "+fila.nombre);
                        //Recuperar datos
                        $("#lista ul").append("<li><a href='#' data-ajax='false'><img src='./img/perfil.png'><div>"+fila.nombre+" "+fila.apellidos+"</div><div>"+fila.cargo+"</div></a></li>").listview('refresh');
                    }
                }
            },
            function(tx, error){
                this.mostrarDBError(error);
            }
        );
    },

    mostrarDBError: function(err){
        console.log("ERROR DE CARGA DE BBDD "+err.code);
        console.log("MENSAJE DE ERROR "+err.message);
    }

};



/*========COMPRUEBA SI EXISTE BBD Y SI NO LA CREA===========*/
var confDB = {
    existe_db: "",
    db: "",
    initialize: function(){
        this.existe_db = window.localStorage.getItem("existe_db");
        this.db = window.openDatabase("localDB", "1.0", "Base de datos de prueba", 2*1024*1024);
        if (this.existe_db == null || this.existe_db == false){
            console.log("NO EXISTE LA BBDD");
            alert("NO EXISTE LA BBDD");
            this.createDB();
        }
        else{
            console.log("BBDD EXISTENTE, CARGANDO...");
            cargarDB.initialize();
        }     
    },
/*========COMPRUEBA SI EXISTE BBD Y SI NO LA CREA===========*/


   
    createDB: function(){
        console.log("CREAMOS LA BBDD");
        this.db.transaction(this.createLocalDB, this.createDBError, this.createDBSucc);
    },
    

    createLocalDB: function(tx){
        var sql = "CREATE TABLE IF NOT EXISTS localDB ("+
                  "id           INTEGER         primary key autoincrement,"+
                  "nombre       VARCHAR(50)     not null,"+
                  "apellidos    VARCHAR(250)    not null,"+
                  "cargo        VARCHAR(250)    not null,"+
                  "email        VARCHAR(250)    not null,"+
                  "edad         INTEGER         not null,"+
                  "telefono     VARCHAR(250)    not null,"+
                  "poblacion    VARCHAR(250)    not null,"+
                  "ultimos      INTEGER(1)      not null);";

            tx.executeSql(sql);
            console.log("TABLA CREADA CORRECTAMENTE");

            sql = "INSERT INTO localDB(id, nombre, apellidos, cargo, email, edad, telefono, poblacion)"+
                  "VALUES(1, 'Pepe', 'Fernandez', 'Profesor', 'pepe@hotmail.com', 40, '666666666', 'Londres',0)";
            tx.executeSql(sql);

            sql = "INSERT INTO localDB(id, nombre, apellidos, cargo, email, edad, telefono, poblacion)"+
                  "VALUES(2, 'Joan', 'Rapinya', 'Profesor', 'joan@gmail.com', 76, '654765743', 'Valencia',1)";
            tx.executeSql(sql);

            sql = "INSERT INTO localDB(id, nombre, apellidos, cargo, email, edad, telefono, poblacion)"+
                  "VALUES(3, 'Julian', 'Molina', 'Alumno', 'julian@gmail.com', 56, '999999999', 'Londres',0)";
            tx.executeSql(sql);

            sql = "INSERT INTO localDB(id, nombre, apellidos, cargo, email, edad, telefono, poblacion)"+
                  "VALUES(4, 'Antonio', 'Silfredo', 'Alumno', '46chovi9@hotmail.es', 23, '777777777', 'Madrid',1)";
            tx.executeSql(sql);

            sql = "INSERT INTO localDB(id, nombre, apellidos, cargo, email, edad, telefono, poblacion)"+
                  "VALUES(5, 'Jaime', 'Jaimito', 'Profesor', 'jumofe95@gmail.es', 33, '567654323', 'Valencia',0)";
            tx.executeSql(sql);
            console.log("INSERCION DE DATOS REALIZADA CORRECTAMENTE");
    },

    createDBError: function(err){
        console.log("ERROR AL CREAR LA BBDD"+err.code);
    },

    createDBSucc: function(){
        console.log("BBDD GENERADA");
        window.localStorage.setItem("existe_db",1);
    }
};



/*================INICIALIZAR LA APP==================================*/
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        */
        console.log('Received Event: ' + id);

        //comprueba si la BBDD está creada
        confDB.initialize();
    }
};
/*================INICIALIZAR LA APP==================================*/