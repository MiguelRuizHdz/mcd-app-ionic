export interface Adeudo {
    id: number;
    idCliente: number;
    fechaCreacion: string;
    concepto?: string;
    precio?: number;
    fechaPagarAntesDe?: string;
    aDeber?: number;
}
