export class SummaryTable {

    public title: string;
    public items: SummaryTableItem[];
    public totalLabel: string;
    public total: number;

    constructor(title:string, totalLabel:string){
        this.title = title;
        this.totalLabel = totalLabel;
        this.items = new Array<SummaryTableItem>();
    }
}

export class SummaryTableItem{

    public model: string;
    public activo: number;
    public averia: number;
    public hold: number;
    public totalItem: number;

    constructor(model:string, activo:number, averia:number, hold:number, totalItem:number){
        this.model = model;
        this.activo = activo;
        this.averia = averia;
        this.hold = hold;
        this.totalItem = totalItem;
    }
}

export enum EEquipmentState{
    Operative = 1,
    Averia = 2,
    Hold = 3,
    Baja = 4,
    Scrap = 5
}
