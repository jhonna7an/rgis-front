export class TabHandler{
  public isDetailTab: boolean;
  public isHistoricTab: boolean;

  constructor(isDetail?: boolean, isHistoric?: boolean){
    this.isDetailTab = isDetail;
    this.isHistoricTab = isHistoric;
  }

  public changeToDetail(){
    this.isDetailTab = true;
    this.isHistoricTab = false;
  }

  public changeToHistoric(){
    this.isDetailTab = false;
    this.isHistoricTab = true;
  }
}
