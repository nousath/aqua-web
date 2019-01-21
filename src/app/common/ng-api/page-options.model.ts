export class PageOptions {
  public query: object = {};
  public offset = 0;
  public limit = 10;

  // TODO: following fields are obsolete
  public noPaging = false;
  public pageSize = 10;
  public pageNo = 1;
  public serverPaging = true;

  constructor(obj?: any) {
    if (!obj) { return; }
    if (obj.offset) { this.offset = obj.offset; }
    if (obj.limit) {
      this.limit = obj.limit;

      this.pageSize = this.limit;
      this.pageNo = 1 + this.offset / this.limit
      this.serverPaging = true;
    }
    if (obj.noPaging) { this.noPaging = obj.noPaging; }

    if (obj.query) {
      this.query = obj.query;
    }
  }

  set(obj?: any) {
    if (obj.limit) {
      this.offset = obj.offset;
      this.limit = obj.limit;

      this.pageSize = this.limit;
      this.pageNo = 1 + this.offset / this.limit
      this.serverPaging = true;
      this.noPaging = false;
    }
  }
}
