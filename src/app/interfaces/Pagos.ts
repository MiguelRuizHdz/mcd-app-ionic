export interface Pago {
    id: number;
    idCliente: number;
    idAdeudo: number;
    fechaPago: string;
    concepto?: string;
    monto?: number;
    folio?: string;
    comprobante?: string;
}
