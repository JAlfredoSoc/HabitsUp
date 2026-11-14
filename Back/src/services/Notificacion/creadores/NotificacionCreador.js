class NotificacionCreador {
    crear(data) {
        return this.crearNotificacion(data);
    }

    crearNotificacion(data){
        throw new Error("Debe de implmentarse");
    }
}


module.exports = NotificacionCreador;