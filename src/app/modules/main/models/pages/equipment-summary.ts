export class CountryDetail {
    public districts: string[];
    public equipments: string[];
    public data: CountryData[];

    constructor(equipments: string[], districts: string[]){
      this.data = new Array<CountryData>();
      this.equipments = equipments;
      this.districts = districts;
    }
}

export class CountryData {
    public district: string;
    public audit: number;
    public laser: number;
    public portatil: number;
    public printer: number;
    public charguer: number;
    public ap: number;
    public tablet: number;

    constructor( district: string, audit: number, laser: number, portatil: number, 
                 printer: number, charguer: number, ap: number, tablet: number ){
      this.district = district;
      this.audit = audit;
      this.laser = laser;
      this.portatil = portatil;
      this.printer = printer;
      this.charguer = charguer;
      this.ap = ap;
      this.tablet = tablet;
    }
}
